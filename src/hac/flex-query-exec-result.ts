export interface FlexQueryExecResult {
  query: string
  executionTime: number
  resultCount: number
  exception: FlexQueryExecResultException
  resultList: string[][]
  headers: string[]
  rawExecution: boolean
  exceptionStackTrace: string
  catalogVersionsAsString: string
  parametersAsString: string
}

export interface FlexQueryExecResultException {
  cause?: FlexQueryExecResultException
  stackTrace: any[]
  localizedMessage: string
  message: string
  suppressed: any[]

  throwable?: any
  errorCode?: any
}
