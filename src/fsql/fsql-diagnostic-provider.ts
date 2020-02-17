import * as vscode from 'vscode'
import { Parser, Grammar } from 'nearley'

export class FsqlDiagnosticProvider {
  constructor(private grammar: Grammar) {}

  public getDiagnostics(document: vscode.TextDocument): vscode.Diagnostic[] {
    if (document.languageId !== 'flexibleSearchQuery') {
      return []
    }

    const text = document.getText()

    const parser = new Parser(this.grammar)
    try {
      parser.feed(text)
    } catch (e) {
      const position = document.positionAt(e.token.offset)
      const range = new vscode.Range(
        position,
        new vscode.Position(
          position.line,
          position.character + e.token.value.length,
        ),
      )
      if (range === undefined) {
        return []
      }

      return [new vscode.Diagnostic(range, e.message)]
    }

    return []
  }
}
