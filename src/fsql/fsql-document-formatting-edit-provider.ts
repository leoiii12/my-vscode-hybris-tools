import * as vscode from 'vscode'

const sqlFormatter = require('@leoiii12/sql-formatter')

export class FsqlDocumentFormattingEditProvider
  implements vscode.DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    const text = document.getText()
    const formattedText = sqlFormatter.format(text, { language: 'flex' })

    const range = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length),
    )

    return [vscode.TextEdit.replace(range, formattedText)]
  }
}
