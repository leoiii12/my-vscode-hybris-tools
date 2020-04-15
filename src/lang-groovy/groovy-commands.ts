import * as vscode from 'vscode'

import { Hac } from '../hac'
import { VscodeUtils } from '../vscode-utils'

export namespace GroovyCommands {
  export async function execute(hac: Hac) {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return
    }

    const activeDocument = editor.document
    const activeViewColumn = editor.viewColumn

    const groovyScriptExecResult = await hac.executeGroovy(
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

  export async function executeAndCommit(hac: Hac) {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return
    }

    const activeDocument = editor.document
    const activeViewColumn = editor.viewColumn

    const groovyScriptExecResult = await hac.executeGroovy(
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
