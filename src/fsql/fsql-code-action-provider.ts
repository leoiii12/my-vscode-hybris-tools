import { Grammar, Parser } from 'nearley'
import * as vscode from 'vscode'

import { lexerRules } from './fsql-lexer'
import { FsqlUtils } from './fsql-utils'

export class FsqlCodeActionProvider implements vscode.CodeActionProvider {
  constructor(private grammar: Grammar) {}

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
    const { beforeText } = FsqlUtils.getBeforeAfterTexts(document, range.start)

    if (beforeText.trimRight().endsWith('1') === true) {
      return this.getActionsForOneEqualOne(document, beforeText)
    }

    return []
  }

  /**
   * This method generates an action for the condition `1` instead of `1 = 1`
   * @param document
   * @param beforeText
   */
  private getActionsForOneEqualOne(
    document: vscode.TextDocument,
    beforeText: string,
  ) {
    const parser = new Parser(this.grammar)
    parser.feed(beforeText)
    parser.finish()

    const prevColumn = (parser as any).table[parser.current - 1]
    const currColumn = (parser as any).table[parser.current]
    if (
      'wants' in prevColumn &&
      Object.keys(prevColumn.wants).some(k => k.startsWith('compare')) &&
      'wants' in currColumn &&
      Object.keys(currColumn.wants).some(k => k.startsWith('compare'))
    ) {
      const codeAction = new vscode.CodeAction(
        '1 is not a preferred condition. Use 1 = 1.',
      )

      codeAction.isPreferred = true

      const latestValueToken = FsqlUtils.findLatestTokenByValue(
        lexerRules,
        beforeText,
        '1',
      )
      if (latestValueToken === undefined) {
        return []
      }

      codeAction.edit = new vscode.WorkspaceEdit()
      codeAction.edit.insert(
        document.uri,
        document.positionAt(latestValueToken.offset + 1),
        ' = 1',
      )

      return [codeAction]
    }
  }
}
