import { Grammar, Parser } from 'nearley'
import * as vscode from 'vscode'

export class FsqlDiagnosticProvider {
  constructor(private grammar: Grammar) {}

  public getDiagnostics(document: vscode.TextDocument): vscode.Diagnostic[] {
    const text = document.getText()

    const parser = new Parser(this.grammar)
    try {
      parser.feed(text)
      parser.finish()

      if (parser.results.length === 0) {
        const range = new vscode.Range(
          document.positionAt(0),
          document.positionAt(document.getText().length),
        )
        if (range === undefined) {
          return []
        }

        return [
          new vscode.Diagnostic(
            range,
            'Not complete.',
            vscode.DiagnosticSeverity.Information,
          ),
        ]
      }
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

      return [
        new vscode.Diagnostic(
          range,
          e.message,
          vscode.DiagnosticSeverity.Error,
        ),
      ]
    }

    return []
  }
}
