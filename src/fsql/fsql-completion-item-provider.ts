import * as vscode from 'vscode'
import { CompletionContext } from 'vscode'
import { Parser, Grammar } from 'nearley'
import { HacUtils } from '../hac-utils'

export class FsqlCompletionItemProvider implements vscode.CompletionItemProvider {
  private characterTokens = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ]

  private numericTokens = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

  private keywordTokens = [
    'SELECT',
    'FROM',
    'WHERE',
    'GROUP BY',
    'UNION',
    'ALL',
    'EXCEPT',
    'MINUS',
    'INTERSECT',

    'ASC',
    'DESC',
    'NULLS',
    'FIRST',
    'LAST',

    'LEFT',
    'JOIN',
    'ON',
    'AS',

    'AND',
    'OR',

    'IS NULL',
    'IS',
    'NOT',
    'NULL',

    'CASE',
    'WHEN',
    'THEN',
    'ELSE',
    'END',

    'TRUE',
    'FALSE',
  ]

  constructor(private grammar: Grammar, private hacUtils: HacUtils) {}

  private static getTokens(text: string): string[] {
    return text.split(/[ \t\n\v\f]/).filter(c => c !== '')
  }

  public provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    cancellationToken: vscode.CancellationToken,
    context: CompletionContext,
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const text = document.getText()

    const tokenRange = document.getWordRangeAtPosition(position) as vscode.Range
    const tokenText = document.getText(tokenRange)

    const beforeRange = new vscode.Range(document.positionAt(0), tokenRange.start)
    const afterRange = new vscode.Range(tokenRange.end, document.positionAt(text.length))

    const beforeText = document.getText(beforeRange)
    const afterText = document.getText(afterRange)

    const beforeTokens = FsqlCompletionItemProvider.getTokens(beforeText)
    const afterTokens = FsqlCompletionItemProvider.getTokens(afterText)

    console.log(beforeTokens)
    console.log(afterTokens)

    const start = new Date().getTime()
    const acceptedTokens = this.getNewTokensIncrementally(beforeTokens, afterTokens)
    const end = new Date().getTime()

    console.log(end - start + 'ms')

    return acceptedTokens.map(at => new vscode.CompletionItem(at))
  }

  private getNewTokensIncrementally(beforeTokens: string[], afterTokens: string[]) {
    let acceptedTokens = FsqlCompletionItemProvider.tryTokens(
      this.grammar,
      this.characterTokens,
      beforeTokens,
      afterTokens,
    )
    if (acceptedTokens.length > 0) {
      return acceptedTokens
    }

    acceptedTokens = FsqlCompletionItemProvider.tryTokens(this.grammar, this.numericTokens, beforeTokens, afterTokens)
    if (acceptedTokens.length > 0) {
      return acceptedTokens
    }

    acceptedTokens = FsqlCompletionItemProvider.tryTokens(this.grammar, this.keywordTokens, beforeTokens, afterTokens)
    if (acceptedTokens.length > 0) {
      return acceptedTokens
    }

    return []
  }

  private static tryTokens(grammar: Grammar, trialTokens: string[], beforeTokens: string[], afterTokens: string[]) {
    return trialTokens.filter(tt => {
      const parser = new Parser(grammar)

      try {
        for (let beforeToken of beforeTokens) {
          parser.feed(beforeToken)
          parser.feed(' ')
        }

        parser.feed(tt)
        parser.feed(' ')

        console.log(parser.current)

        for (let afterToken of afterTokens) {
          parser.feed(afterToken)
          parser.feed(' ')
        }

        parser.finish()
      } catch (e) {
        // console.log(e)

        return false
      }

      return true
    })
  }
}
