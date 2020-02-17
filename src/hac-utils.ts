import { Config } from './config'
import axios, { AxiosInstance } from 'axios'
import { Agent } from 'https'
import * as cheerio from 'cheerio'
import * as qs from 'querystring'
import { CookieJar } from 'tough-cookie'

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

export class HacUtils {
  private axiosInstance: AxiosInstance | undefined
  private initTimestamp: number | undefined

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

  private async initSession() {
    if (
      this.initTimestamp !== undefined &&
      new Date().getTime() - this.initTimestamp < 1000 * 60 * 5
    ) {
      return
    }

    if (this.initTimestamp !== undefined) {
      console.log('The session is expired. Now renewing.')
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

  public async executeFlexibleSearch(
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

  public async executeGroovy(
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

  public async clearCache(): Promise<any> {
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
