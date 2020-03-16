import { FlexQueryExecResult } from './flex-query-exec-result'
import { GroovyExecResult } from './groovy-exec-result'

export interface Hac {
  executeFlexibleSearch(
    maxCount: number,
    fsql?: string,
    sql?: string,
  ): Promise<FlexQueryExecResult>
  executeGroovy(commit: boolean, script: string): Promise<GroovyExecResult>
  validateImpEx(impEx: string): Promise<void>
  importImpEx(impEx: string): Promise<void>
  clearCaches(): Promise<void>
}
