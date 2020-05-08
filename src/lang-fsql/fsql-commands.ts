import * as vscode from 'vscode'

import { Hac } from '../hac'
import { VscodeUtils } from '../vscode-utils'

const sqlFormatter = require('@leoiii12/sql-formatter')

export namespace FsqlCommands {
  export async function execute(hac: Hac): Promise<boolean> {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return false
    }

    const activeDocument = editor.document
    const activeViewColumn = editor.viewColumn

    const flexQueryExecResult = await hac.executeFlexibleSearch(
      100000,
      VscodeUtils.getSelectedTextOrDocumentText(editor),
    )

    if (flexQueryExecResult.exception) {
      if (flexQueryExecResult.exception.message) {
        await VscodeUtils.openTxtWindow(
          flexQueryExecResult.exception.message,
          `${new Date().getTime()}.exception.txt`,
        )
      } else {
        await VscodeUtils.openTxtWindow(
          JSON.stringify(flexQueryExecResult.exception, null, 2),
          `${new Date().getTime()}.exception.json`,
        )
      }

      return false
    } else if (flexQueryExecResult.exceptionStackTrace) {
      await VscodeUtils.openTxtWindow(
        flexQueryExecResult.exceptionStackTrace,
        `${new Date().getTime()}.exceptionStackTrace.txt`,
      )

      return false
    }

    await VscodeUtils.openCsvWindow(
      flexQueryExecResult.headers,
      flexQueryExecResult.resultList,
    )
    await vscode.window.showTextDocument(activeDocument, activeViewColumn)

    return true
  }

  export async function executeRawSql(hac: Hac): Promise<boolean> {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return false
    }

    const activeDocument = editor.document
    const activeViewColumn = editor.viewColumn

    const flexQueryExecResult = await hac.executeFlexibleSearch(
      100000,
      undefined,
      VscodeUtils.getSelectedTextOrDocumentText(editor),
    )

    if (flexQueryExecResult.exception) {
      await VscodeUtils.openTxtWindow(
        flexQueryExecResult.exception.message
          ? flexQueryExecResult.exception.message
          : JSON.stringify(flexQueryExecResult.exception, null, 2),
        `${new Date().getTime()}.exception.txt`,
      )
      await vscode.window.showTextDocument(activeDocument, activeViewColumn)

      return false
    } else if (flexQueryExecResult.exceptionStackTrace) {
      await VscodeUtils.openTxtWindow(
        flexQueryExecResult.exceptionStackTrace,
        `${new Date().getTime()}.exceptionStackTrace.txt`,
      )
      await vscode.window.showTextDocument(activeDocument, activeViewColumn)

      return false
    }

    await VscodeUtils.openCsvWindow(
      flexQueryExecResult.headers,
      flexQueryExecResult.resultList,
    )
    await vscode.window.showTextDocument(activeDocument, activeViewColumn)

    return true
  }

  export async function translateFsqlToRawSql(hac: Hac): Promise<boolean> {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return false
    }

    const activeDocument = editor.document
    const activeViewColumn = editor.viewColumn

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
    const execResult = await hac.executeGroovy(false, groovy)

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

    const translatePkFsql = `
      SELECT
        {ct.pk},
        {ct.code}
      FROM
        { ComposedType AS ct }
      WHERE
        {ct.pk} IN ($_PK_JOINED_STR)
    `
    const fsqlExecResult = await hac.executeFlexibleSearch(
      10000,
      translatePkFsql.replace('$_PK_JOINED_STR', sqlQueryParameters.join(',')),
    )
    const pkSqls = fsqlExecResult.resultList.reduce((acc, result) => {
      acc[
        result[0]
      ] = `SELECT pk FROM composedtypes WHERE InternalCode = '${result[1]}'`
      return acc
    }, {} as { [pk: string]: string })

    try {
      let mySqlQuery = `${sqlQuery};`

      for (const pk of sqlQueryParameters) {
        const sqlOrPk = pk in pkSqls ? ` (${pkSqls[pk]})` : pk

        if (mySqlQuery.includes('?')) {
          mySqlQuery = mySqlQuery.replace('?', sqlOrPk)
        } else {
          throw new Error('No more values to replace parameters.')
        }
      }
      if (mySqlQuery.includes('?')) {
        throw new Error('Still have parameters.')
      }

      const formattedSql = sqlFormatter.format(mySqlQuery, { language: 'sql' })

      await VscodeUtils.openTxtWindow(
        formattedSql,
        `${new Date().getTime()}.sql`,
      )
      await vscode.window.showTextDocument(activeDocument, activeViewColumn)

      return true
    } catch (e) {
      vscode.window.showErrorMessage("Can't match all parameters.")

      await VscodeUtils.openTxtWindow(sqlQuery, `${new Date().getTime()}.sql`)
      await VscodeUtils.openTxtWindow(
        JSON.stringify(sqlQueryParameters),
        `${new Date().getTime()}.parameters.json`,
      )
      await vscode.window.showTextDocument(activeDocument, activeViewColumn)

      return false
    }
  }
}
