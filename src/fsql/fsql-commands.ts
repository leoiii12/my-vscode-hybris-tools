import * as vscode from 'vscode'

import { HacUtils } from '../hac-utils'
import { VscodeUtils } from '../vscode-utils'

export namespace FsqlCommands {
  /**
   * vscode-hybris-tools.flexibleSearchQuery.execute
   * @param hacUtils
   */
  export async function execute(hacUtils: HacUtils) {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return
    }

    const flexQueryExecResult = await hacUtils.executeFlexibleSearch(
      100000,
      VscodeUtils.getSelectedTextOrDocumentText(editor),
    )

    if (
      flexQueryExecResult.exception ||
      flexQueryExecResult.exceptionStackTrace
    ) {
      console.log(flexQueryExecResult)

      VscodeUtils.openTxtWindow(
        JSON.stringify(flexQueryExecResult.exception, null, 2),
        `${new Date().toISOString()}.exception.json`,
      )
      VscodeUtils.openTxtWindow(
        flexQueryExecResult.exceptionStackTrace,
        `${new Date().toISOString()}.exceptionStackTrace.txt`,
      )

      return
    }

    await VscodeUtils.openCsvWindow(
      flexQueryExecResult.headers,
      flexQueryExecResult.resultList,
    )
  }

  export async function executeRawSql(hacUtils: HacUtils) {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return
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
        `${new Date().toISOString()}.exception.json`,
      )
      VscodeUtils.openTxtWindow(
        flexQueryExecResult.exceptionStackTrace,
        `${new Date().toISOString()}.exceptionStackTrace.txt`,
      )

      return
    }

    await VscodeUtils.openCsvWindow(
      flexQueryExecResult.headers,
      flexQueryExecResult.resultList,
    )
  }
}
