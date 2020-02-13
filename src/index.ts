import { HacUtils } from './hac-utils'

async function main() {
  const hacUtils = new HacUtils()
  const execResult = await hacUtils.executeFlexibleSearch(10, `SELECT DISTINCT { code } AS InternalCode FROM { composedtype } WHERE InternalCode LIKE 'A%'`)

  
  console.log(execResult.resultList.map(rl => rl[0]))
}

main()
