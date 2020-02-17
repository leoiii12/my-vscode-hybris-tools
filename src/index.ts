import { HacUtils } from './hac-utils'

async function main() {
  const hacUtils = new HacUtils()

  const flexQueryExecResult = await hacUtils.executeFlexibleSearch(
    10,
    `SELECT DISTINCT { code } AS InternalCode FROM { composedtype } WHERE InternalCode LIKE 'A%'`,
  )
  console.log(flexQueryExecResult.resultList.map(rl => rl[0]))

  const groovyScriptResult = await hacUtils.executeGroovy(
    false,
    `spring.beanDefinitionNames.each {
      println it
  }
  return "Groovy Rocks!"`,
  )
  console.log(groovyScriptResult)
}

main()
