import { HacUtils } from './hac-utils'

export class InternalCaches {
  public hasConfirmedConfigs = false

  public fsqlComposedTypeCodes: string[] = []
  public fsqlComposedTypeAttributes: {
    [type: string]: { qualifier: string; typeCode: string }[]
  } = {}

  public async init(hacUtils: HacUtils) {
    this.fsqlComposedTypeCodes = []
    this.fsqlComposedTypeAttributes = {}

    return hacUtils
      .executeFlexibleSearch(
        3000,
        `SELECT DISTINCT { code } AS InternalCode FROM { composedtype }`,
      )
      .then(execResult => {
        this.fsqlComposedTypeCodes = execResult.resultList.map(rl => rl[0])
      })
  }
}
