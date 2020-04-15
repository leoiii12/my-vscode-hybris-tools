import { Hac } from './hac'

export class InternalCaches {
  public hasConfirmedConfigs = false

  public fsqlComposedTypeCodes: string[] = []
  public fsqlComposedTypeAttributes: {
    [type: string]: { qualifier: string; typeCode: string }[]
  } = {}

  public async init(hac: Hac) {
    this.fsqlComposedTypeCodes = []
    this.fsqlComposedTypeAttributes = {}

    return hac
      .executeFlexibleSearch(
        3000,
        `SELECT DISTINCT { code } AS InternalCode FROM { composedtype }`,
      )
      .then(execResult => {
        this.fsqlComposedTypeCodes = execResult.resultList.map(rl => rl[0])
      })
  }
}
