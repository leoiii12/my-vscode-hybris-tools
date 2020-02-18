import * as vscode from 'vscode'

import { HacUtils } from '../hac-utils'
import { VscodeUtils } from '../vscode-utils'

export namespace GroovyCommands {
  export async function execute(hacUtils: HacUtils) {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return
    }

    const groovyScriptExecResult = await hacUtils.executeGroovy(
      false,
      VscodeUtils.getSelectedTextOrDocumentText(editor),
    )

    VscodeUtils.openTxtWindow(
      groovyScriptExecResult.outputText,
      `${new Date().toISOString()}.output.txt`,
    )
    VscodeUtils.openTxtWindow(
      groovyScriptExecResult.executionResult,
      `${new Date().toISOString()}.executionResult.txt`,
    )
    if (groovyScriptExecResult.stacktraceText !== '') {
      VscodeUtils.openTxtWindow(
        groovyScriptExecResult.stacktraceText,
        `${new Date().toISOString()}.stacktraceText.txt`,
      )
    }
  }

  export async function executeAndCommit(hacUtils: HacUtils) {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return
    }

    const groovyScriptExecResult = await hacUtils.executeGroovy(
      true,
      VscodeUtils.getSelectedTextOrDocumentText(editor),
    )

    VscodeUtils.openTxtWindow(
      groovyScriptExecResult.outputText,
      `${new Date().toISOString()}.output.txt`,
    )
    VscodeUtils.openTxtWindow(
      groovyScriptExecResult.executionResult,
      `${new Date().toISOString()}.executionResult.txt`,
    )
    if (groovyScriptExecResult.stacktraceText !== '') {
      VscodeUtils.openTxtWindow(
        groovyScriptExecResult.stacktraceText,
        `${new Date().toISOString()}.stacktraceText.txt`,
      )
    }
  }
}
