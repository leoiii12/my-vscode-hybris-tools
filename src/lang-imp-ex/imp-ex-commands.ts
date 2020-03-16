import * as vscode from 'vscode'

import { Hac } from '../hac'
import { VscodeUtils } from '../vscode-utils'

export namespace ImpExCommands {
  export async function importImpEx(hac: Hac) {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return
    }

    await hac.importImpEx(VscodeUtils.getSelectedTextOrDocumentText(editor))

    vscode.window.showInformationMessage('Done importing.')
  }

  export async function validateImpEx(hac: Hac) {
    const editor = vscode.window.activeTextEditor
    if (editor === undefined) {
      return
    }

    await hac.validateImpEx(VscodeUtils.getSelectedTextOrDocumentText(editor))

    vscode.window.showInformationMessage('Done validating.')
  }
}
