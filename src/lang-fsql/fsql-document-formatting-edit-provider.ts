import { Grammar, Parser } from 'nearley'
import * as vscode from 'vscode'

import { FsqlFormatter } from './internal/fsql-formatter'

const sqlFormatter = require('@leoiii12/sql-formatter')

export class FsqlDocumentFormattingEditProvider
  implements vscode.DocumentFormattingEditProvider {
  constructor(private grammar: Grammar) {}

  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    const text = document.getText()

    const parser = new Parser(this.grammar)
    try {
      parser.feed(text)
      parser.finish()

      const formatter = new FsqlFormatter()
      const formattedText = formatter.getFormattedFsql(parser.results[0])

      const range = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length),
      )
      return [vscode.TextEdit.replace(range, formattedText)]
    } catch (e) {
      console.log(
        `Can't format the fsql. Fallback the the token based formatter.`,
      )
    }

    const formattedText = sqlFormatter.format(text, { language: 'flex' })

    const range = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length),
    )
    return [vscode.TextEdit.replace(range, formattedText)]
  }
}
