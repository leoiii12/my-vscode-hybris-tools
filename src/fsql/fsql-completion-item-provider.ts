import * as vscode from 'vscode'
import { CompletionContext } from 'vscode'
import { Parser, Grammar, LexerState } from 'nearley'
import { HacUtils } from '../hac-utils'

export class FsqlCompletionItemProvider implements vscode.CompletionItemProvider {
  private characterTokens = ['a']
  private numericTokens = ['0']
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

  private types: string[] = []

  constructor(private grammar: Grammar, hacUtils: HacUtils) {
    hacUtils
      .executeFlexibleSearch(3000, `SELECT DISTINCT { code } AS InternalCode FROM { composedtype }`)
      .then(execResult => {
        this.types = execResult.resultList.map(rl => rl[0])
      })
  }

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

    const tokens = this.getNewTokensIncrementally(beforeTokens, tokenText, afterTokens)

    const end = new Date().getTime()
    console.log(`Completed in ${end - start}ms.`)

    return tokens.map(at => new vscode.CompletionItem(at))
  }

  private getNewTokensIncrementally(beforeTokens: string[], token: string, afterTokens: string[]) {
    let acceptedTokens = FsqlCompletionItemProvider.tryTokens(
      this.grammar,
      this.characterTokens,
      beforeTokens,
      afterTokens,
    )
    if (acceptedTokens.length > 0 && /[a-zA-Z]+/.test(token)) {
      return this.types
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
    const parser = new Parser(grammar)

    for (let beforeToken of beforeTokens) {
      parser.feed(beforeToken)
      parser.feed(' ')
    }
    const state = parser.save()

    return trialTokens.filter(tt => {
      try {
        parser.restore(state)

        parser.feed(tt)
        parser.feed(' ')

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
