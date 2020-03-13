import * as vscode from 'vscode'

import { HacUtils } from '../hac-utils'
import { VscodeUtils } from '../vscode-utils'

export namespace ImpExCommands {
  export async function importImpEx(hacUtils: HacUtils) {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return
    }

    await hacUtils.importImpEx(
      VscodeUtils.getSelectedTextOrDocumentText(editor),
    )

    vscode.window.showInformationMessage('Done importing.')
  }

  export async function validateImpEx(hacUtils: HacUtils) {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return
    }

    await hacUtils.validateImpEx(
      VscodeUtils.getSelectedTextOrDocumentText(editor),
    )

    vscode.window.showInformationMessage('Done validating.')
  }
}
