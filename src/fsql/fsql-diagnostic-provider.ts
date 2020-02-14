import * as vscode from 'vscode'
import { Parser, Grammar } from 'nearley'

export class FsqlDiagnosticProvider {
  constructor(private grammar: Grammar) {}

  public getDiagnostics(document: vscode.TextDocument): vscode.Diagnostic[] {
    const text = document.getText()

    const parser = new Parser(this.grammar)
    try {
      parser.feed(text)
    } catch (e) {
      const position = document.positionAt(e.offset)
      const wordPosition = document.getWordRangeAtPosition(position)
      if (wordPosition === undefined) {
        return []
      }

      const diagnostic = new vscode.Diagnostic(wordPosition, e.message)
      return [diagnostic]
    }

    return []
  }
}
