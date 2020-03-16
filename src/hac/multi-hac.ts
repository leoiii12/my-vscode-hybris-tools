import { InternalCaches } from '../internal-caches'
import { FlexQueryExecResult } from './flex-query-exec-result'
import { GroovyExecResult } from './groovy-exec-result'
import { Hac } from './hac'
import { HacImpl } from './hac-impl'

export class MultiHac implements Hac {
  constructor(numOfWorkers: number, caches?: InternalCaches) {
    for (let i = 0; i < numOfWorkers; i++) {
      this.hacImpls.push(new HacImpl(caches))
    }
  }

  private hacImpls: HacImpl[] = []

  private getHacIdx = 0
  private getHac() {
    this.getHacIdx += 1
    this.getHacIdx = this.getHacIdx >= this.hacImpls.length ? 0 : this.getHacIdx
    return this.hacImpls[this.getHacIdx]
  }

  executeFlexibleSearch(
    maxCount: number,
    fsql?: string | undefined,
    sql?: string | undefined,
  ): Promise<FlexQueryExecResult> {
    return this.getHac().executeFlexibleSearch(maxCount, fsql, sql)
  }

  executeGroovy(commit: boolean, script: string): Promise<GroovyExecResult> {
    return this.getHac().executeGroovy(commit, script)
  }

  validateImpEx(impEx: string): Promise<void> {
    return this.getHac().validateImpEx(impEx)
  }

  importImpEx(impEx: string): Promise<void> {
    return this.getHac().importImpEx(impEx)
  }

  clearCaches(): Promise<void> {
    return this.getHac().clearCaches()
  }
}
