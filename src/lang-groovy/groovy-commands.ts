import * as vscode from 'vscode'

import { HacUtils } from '../hac-utils'
import { VscodeUtils } from '../vscode-utils'

export namespace GroovyCommands {
  export async function execute(hacUtils: HacUtils) {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return
    }

    const activeDocument = editor.document
    const activeViewColumn = editor.viewColumn

    const groovyScriptExecResult = await hacUtils.executeGroovy(
      false,
      VscodeUtils.getSelectedTextOrDocumentText(editor),
    )

    await VscodeUtils.openTxtWindow(
      groovyScriptExecResult.outputText,
      `${new Date().getTime()}.output.txt`,
    )
    await VscodeUtils.openTxtWindow(
      groovyScriptExecResult.executionResult,
      `${new Date().getTime()}.executionResult.txt`,
    )
    if (groovyScriptExecResult.stacktraceText !== '') {
      await VscodeUtils.openTxtWindow(
        groovyScriptExecResult.stacktraceText,
        `${new Date().getTime()}.stacktraceText.txt`,
      )
    }
    await vscode.window.showTextDocument(activeDocument, activeViewColumn)
  }

  export async function executeAndCommit(hacUtils: HacUtils) {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return
    }

    const activeDocument = editor.document
    const activeViewColumn = editor.viewColumn

    const groovyScriptExecResult = await hacUtils.executeGroovy(
      true,
      VscodeUtils.getSelectedTextOrDocumentText(editor),
    )

    await VscodeUtils.openTxtWindow(
      groovyScriptExecResult.outputText,
      `${new Date().getTime()}.output.txt`,
    )
    await VscodeUtils.openTxtWindow(
      groovyScriptExecResult.executionResult,
      `${new Date().getTime()}.executionResult.txt`,
    )
    if (groovyScriptExecResult.stacktraceText !== '') {
      await VscodeUtils.openTxtWindow(
        groovyScriptExecResult.stacktraceText,
        `${new Date().getTime()}.stacktraceText.txt`,
      )
    }
    await vscode.window.showTextDocument(activeDocument, activeViewColumn)
  }
}
