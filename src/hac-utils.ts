import axios, { AxiosInstance } from 'axios'
import * as cheerio from 'cheerio'
import { Agent } from 'https'
import * as qs from 'querystring'
import { CookieJar } from 'tough-cookie'

import { Config } from './config'
import { Subject, zip, Observer, Observable } from 'rxjs'

const axiosCookiejarSupport = require('axios-cookiejar-support').default

export interface Exception {
  cause?: Exception
  stackTrace: any[]
  localizedMessage: string
  message: string
  suppressed: any[]

  throwable?: any
  errorCode?: any
}

export interface FlexQueryExecResult {
  query: string
  executionTime: number
  resultCount: number
  exception: Exception
  resultList: string[][]
  headers: string[]
  rawExecution: boolean
  exceptionStackTrace: string
  catalogVersionsAsString: string
  parametersAsString: string
}

export interface GroovyExecResult {
  stacktraceText: string
  executionResult: string
  outputText: string
}

class Lock {
  private lockAcquire = new Subject<Observer<void>>()
  private lockRelease = new Subject()

  constructor() {
    zip(this.lockAcquire, this.lockRelease.asObservable()).subscribe(
      ([acquirer, released]) => {
        acquirer.next()
        acquirer.complete()
      },
    )

    this.release()
  }

  public acquire(): Observable<void> {
    return Observable.create((observer: Observer<void>) => {
      this.lockAcquire.next(observer)
    })
  }

  public release() {
    this.lockRelease.next()
  }
}

export class HacUtils {
  private axiosInstance: AxiosInstance | undefined
  private initTimestamp: number | undefined

  /**
   * To make sure this is thread-safe, this needs to acquire the lock before proceeding
   */
  private lock = new Lock()

  private readonly credentials = {
    csrf: '',
    sessionId: '',
  }

  private get csrf(): string {
    return this.credentials.csrf
  }
  private set csrf(csrf: string) {
    this.credentials.csrf = csrf

    if (this.axiosInstance) {
      this.axiosInstance.defaults.headers.post['X-CSRF-Token'] = csrf
    }
  }

  private get sessionId(): string {
    return this.credentials.sessionId
  }
  private set sessionId(sessionId: string) {
    this.credentials.sessionId = sessionId
  }

  constructor() {}

  public async executeFlexibleSearch(
    maxCount: number,
    fsql?: string,
    sql?: string,
  ) {
    await this.lock.acquire().toPromise()

    return this._executeFlexibleSearch(maxCount, fsql, sql).finally(() => {
      this.lock.release()
    })
  }

  public async executeGroovy(commit: boolean, script: string) {
    await this.lock.acquire().toPromise()

    return this._executeGroovy(commit, script).finally(() => {
      this.lock.release()
    })
  }

  public async validateImpEx(impEx: string) {
    await this.lock.acquire().toPromise()

    return this._validateImpEx(impEx).finally(() => {
      this.lock.release()
    })
  }

  public async importImpEx(impEx: string) {
    await this.lock.acquire().toPromise()

    return this._importImpEx(impEx).finally(() => {
      this.lock.release()
    })
  }

  public async clearCaches() {
    await this.lock.acquire().toPromise()

    return this._clearCaches().finally(() => {
      this.lock.release()
    })
  }

  private async initSession() {
    if (
      this.initTimestamp !== undefined &&
      new Date().getTime() - this.initTimestamp < 1000 * 60 * 5
    ) {
      return
    }

    if (this.initTimestamp !== undefined) {
      console.log('[initSession] - The session is expired. Now renewing.')
    }

    this.initTimestamp = new Date().getTime()
    this.csrf = ''
    this.sessionId = ''

    this.axiosInstance = axios.create({
      baseURL: Config.getHacUrl(),
      timeout: Config.getHttpTimeout(),
      withCredentials: true,
      httpsAgent: new Agent({
        rejectUnauthorized: Config.getHttpUseStrictSSL() === true,
        requestCert: true,
        keepAlive: true,
      }),
    })

    axiosCookiejarSupport(this.axiosInstance)
    ;(this.axiosInstance.defaults as any).jar = new CookieJar()

    const res = await this.axiosInstance.get(Config.getHacUrl())

    const html = cheerio.load(res.data)

    this.csrf = html('input[name=_csrf]').val()
    this.sessionId = (res.headers['set-cookie'][0] as string).split(';')[0]
  }

  private async logIn() {
    await this.initSession()

    const logInCsrf = this.csrf
    const sessionId = this.sessionId

    const logInForm = {
      j_username: Config.getHacUsername(),
      j_password: Config.getHacPassword(),
      _csrf: logInCsrf,
    }

    const headers = {
      Cookie: sessionId,
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRF-TOKEN': logInCsrf,
    }

    const logInRes = await this.axiosInstance!.post(
      '/j_spring_security_check',
      qs.stringify(logInForm),
      {
        headers,
      },
    )

    const consoleImpexImportRes = await this.axiosInstance!.get(
      '/console/impex/import',
      {
        headers: {
          Cookie: this.sessionId,
        },
      },
    )

    const consoleImpexImportCsrf = cheerio
      .load(consoleImpexImportRes.data)('input[name=_csrf]')
      .val()

    this.csrf = consoleImpexImportCsrf

    return this.credentials
  }

  private async _executeFlexibleSearch(
    maxCount: number,
    fsql?: string,
    sql?: string,
  ): Promise<FlexQueryExecResult> {
    if (fsql === undefined && sql === undefined) {
      throw new Error()
    }

    await this.logIn()

    const csrf = this.csrf
    const sessionId = this.sessionId

    const executeForm = {
      _csrf: csrf,
      commit: false,
      flexibleSearchQuery: fsql === undefined ? null : fsql,
      locale: 'en',
      maxCount: maxCount,
      sqlQuery: sql === undefined ? null : sql,
      user: 'admin',
    }

    const res = await this.axiosInstance!.post(
      '/console/flexsearch/execute',
      qs.stringify(executeForm),
      {
        headers: {
          Cookie: sessionId,
        },
      },
    )

    return res.data
  }

  private async _executeGroovy(
    commit: boolean,
    script: string,
  ): Promise<GroovyExecResult> {
    await this.logIn()

    const csrf = this.csrf
    const sessionId = this.sessionId

    const executeForm = {
      _csrf: csrf,
      commit: commit,
      scriptType: 'groovy',
      script: script,
    }

    const res = await this.axiosInstance!.post(
      '/console/scripting/execute',
      qs.stringify(executeForm),
      {
        headers: {
          Cookie: sessionId,
        },
      },
    )

    return res.data
  }

  private async _validateImpEx(impEx: string): Promise<void> {
    await this.logIn()

    const csrf = this.csrf
    const sessionId = this.sessionId

    const executeForm = {
      scriptContent: impEx,
      validationEnum: 'IMPORT_STRICT',
      maxThreads: 1,
      encoding: 'UTF-8',
      _legacyMode: 'on',
      _enableCodeExecution: 'on',
      _csrf: csrf,
      _distributedMode: 'on',
      _sldEnabled: 'on',
    }

    const res = await this.axiosInstance!.post(
      `/console/impex/import/validate`,
      qs.stringify(executeForm),
      {
        headers: {
          Cookie: sessionId,
        },
      },
    )

    if (res.status !== 200) {
      throw new Error(
        `The server is returning ${res.status}. Please check whether the server is on.`,
      )
    }

    var html = cheerio.load(res.data)
    var impExExecMsg = html(
      "span#validationResultMsg[data-level='error']",
    ).attr('data-result')
    if (impExExecMsg !== undefined) {
      throw new Error(
        `Hybris found some errors in your impEx. Msg = "${impExExecMsg}"`,
      )
    }
  }

  public async _importImpEx(impEx: string): Promise<void> {
    await this.logIn()

    const csrf = this.csrf
    const sessionId = this.sessionId

    const executeForm = {
      scriptContent: impEx,
      validationEnum: 'IMPORT_STRICT',
      maxThreads: 1,
      encoding: 'UTF-8',
      _legacyMode: 'on',
      _enableCodeExecution: 'on',
      _csrf: csrf,
      _distributedMode: 'on',
      _sldEnabled: 'on',
    }

    const res = await this.axiosInstance!.post(
      `/console/impex/import`,
      qs.stringify(executeForm),
      {
        headers: {
          Cookie: sessionId,
        },
      },
    )

    if (res.status !== 200) {
      throw new Error(
        `The server is returning ${res.status}. Please check whether the server is on.`,
      )
    }

    var html = cheerio.load(res.data)
    var impExExecMsg = html("span#impexResult[data-level='error']").attr(
      'data-result',
    )
    if (impExExecMsg !== undefined) {
      throw new Error(
        `Hybris found some errors in your impEx. Msg = "${impExExecMsg}"`,
      )
    }
  }

  public async _clearCaches(): Promise<any> {
    await this.logIn()

    const csrf = this.csrf
    const sessionId = this.sessionId

    const executeForm = {
      _csrf: csrf,
    }

    const res = await this.axiosInstance!.post(
      '/monitoring/cache/regionCache/clear',
      qs.stringify(executeForm),
      {
        headers: {
          Cookie: sessionId,
        },
      },
    )

    return res.data
  }
}
