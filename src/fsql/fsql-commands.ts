import * as vscode from 'vscode'

import { HacUtils } from '../hac-utils'
import { VscodeUtils } from '../vscode-utils'

const sqlFormatter = require('@leoiii12/sql-formatter')

export namespace FsqlCommands {
  /**
   * vscode-hybris-tools.flexibleSearchQuery.execute
   * @param hacUtils
   */
  export async function execute(hacUtils: HacUtils): Promise<boolean> {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return false
    }

    const flexQueryExecResult = await hacUtils.executeFlexibleSearch(
      100000,
      VscodeUtils.getSelectedTextOrDocumentText(editor),
    )

    if (flexQueryExecResult.exception) {
      if (flexQueryExecResult.exception.message) {
        VscodeUtils.openTxtWindow(
          JSON.stringify(flexQueryExecResult, null, 2),
          `${new Date().getTime()}.exception.json`,
        )
      } else {
        VscodeUtils.openTxtWindow(
          JSON.stringify(flexQueryExecResult.exception, null, 2),
          `${new Date().getTime()}.exception.json`,
        )
      }

      return false
    } else if (flexQueryExecResult.exceptionStackTrace) {
      VscodeUtils.openTxtWindow(
        JSON.stringify(flexQueryExecResult.exceptionStackTrace, null, 2),
        `${new Date().getTime()}.exceptionStackTrace.json`,
      )

      return false
    }

    await VscodeUtils.openCsvWindow(
      flexQueryExecResult.headers,
      flexQueryExecResult.resultList,
    )

    return true
  }

  export async function executeRawSql(hacUtils: HacUtils): Promise<boolean> {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return false
    }

    const flexQueryExecResult = await hacUtils.executeFlexibleSearch(
      100000,
      undefined,
      VscodeUtils.getSelectedTextOrDocumentText(editor),
    )

    if (
      flexQueryExecResult.exception ||
      flexQueryExecResult.exceptionStackTrace
    ) {
      console.log(flexQueryExecResult)

      VscodeUtils.openTxtWindow(
        JSON.stringify(flexQueryExecResult.exception, null, 2),
        `${new Date().getTime()}.exception.json`,
      )
      VscodeUtils.openTxtWindow(
        flexQueryExecResult.exceptionStackTrace,
        `${new Date().getTime()}.exceptionStackTrace.txt`,
      )

      return false
    }

    await VscodeUtils.openCsvWindow(
      flexQueryExecResult.headers,
      flexQueryExecResult.resultList,
    )

    return true
  }

  export async function translateFsqlToRawSql(
    hacUtils: HacUtils,
  ): Promise<boolean> {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return false
    }

    const translateGroovy = `
      import com.google.gson.Gson
      import de.hybris.platform.servicelayer.search.FlexibleSearchQuery
      import de.hybris.platform.servicelayer.search.FlexibleSearchService
      
      FlexibleSearchService flexibleSearchService = spring.getBean("flexibleSearchService")
      
      String query = """
      $_FSQL
      """
      
      FlexibleSearchQuery flexibleSearchQuery = new FlexibleSearchQuery(query)
      flexibleSearchQuery.addQueryParameters(new HashMap<>())
      
      try {
          def translationResult = flexibleSearchService.translate(flexibleSearchQuery)
      
          def sqlQuery = translationResult.getSQLQuery()
          def sqlQueryParameters = translationResult.getSQLQueryParameters()
      
      
          def obj = new HashMap()
          obj.put("sqlQuery", sqlQuery)
          obj.put("sqlQueryParameters", sqlQueryParameters.stream().map { p -> (String) p }.collect())
      
          new Gson().toJson(obj)
      } catch (Exception e) {
          def obj = new HashMap()
          obj.put("sqlQuery", "")
          obj.put("sqlQueryParameters", new ArrayList())
      
          new Gson().toJson(obj)
      }
    `

    const groovy = translateGroovy.replace(
      '$_FSQL',
      VscodeUtils.getSelectedTextOrDocumentText(editor),
    )
    const execResult = await hacUtils.executeGroovy(false, groovy)

    const obj = JSON.parse(execResult.executionResult)
    if (
      obj === null ||
      typeof obj !== 'object' ||
      'sqlQuery' in obj === false ||
      'sqlQueryParameters' in obj === false
    ) {
      vscode.window.showErrorMessage(
        "Can't translate the fsql. Please validate the syntax.",
      )
      return false
    }

    const sqlQuery = obj['sqlQuery'] as string
    const sqlQueryParameters = obj['sqlQueryParameters'] as string[]
    if (sqlQuery === '') {
      vscode.window.showErrorMessage(
        "Can't translate the fsql. Please validate the syntax.",
      )
      return false
    }

    try {
      let mySqlQuery = sqlQuery

      for (const param of sqlQueryParameters) {
        if (mySqlQuery.includes('?')) {
          mySqlQuery = mySqlQuery.replace('?', param)
        } else {
          throw new Error('No more values to replace parameters.')
        }
      }
      if (mySqlQuery.includes('?')) {
        throw new Error('Still have parameters.')
      }

      const formattedSql = sqlFormatter.format(mySqlQuery, { language: 'sql' })

      VscodeUtils.openTxtWindow(formattedSql, `${new Date().getTime()}.sql`)

      return true
    } catch (e) {
      vscode.window.showErrorMessage("Can't match all parameters.")

      VscodeUtils.openTxtWindow(sqlQuery, `${new Date().getTime()}.sql`)
      VscodeUtils.openTxtWindow(
        JSON.stringify(sqlQueryParameters),
        `${new Date().getTime()}.parameters.json`,
      )

      return false
    }
  }
}
