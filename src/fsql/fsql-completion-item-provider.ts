import * as vscode from 'vscode'
import { CompletionContext } from 'vscode'
import { Parser, Grammar } from 'nearley'
import { HacUtils } from '../hac-utils'
import { FsqlGrammarUtils } from './fsql-grammar-utils'
import { FsqlUtils } from './fsql-utils'

export class FsqlCompletionItemProvider
  implements vscode.CompletionItemProvider {
  private characterTokens = ['a']
  private numericTokens = ['0']
  private keywordTokens = [
    'SELECT',
    'FROM',
    'WHERE 1 = 1',
    'GROUP BY',
    'ORDER BY',
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

    'LEFT JOIN placeholder',
    'JOIN placeholder',
    'ON 1 = 1',
    'AS placeholder',

    'AND',
    'OR',

    'IS NULL',
    'IS NOT NULL',
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

  constructor(private grammar: Grammar, private hacUtils: HacUtils) {
    hacUtils
      .executeFlexibleSearch(
        3000,
        `SELECT DISTINCT { code } AS InternalCode FROM { composedtype }`,
      )
      .then(execResult => {
        this.types = execResult.resultList.map(rl => rl[0])
      })
  }

  public provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    cancellationToken: vscode.CancellationToken,
    context: CompletionContext,
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    if (document.languageId !== 'flexibleSearchQuery') {
      return []
    }

    const start = new Date().getTime()

    const { beforeText, tokenText, afterText } = FsqlUtils.getBeforeAfterText(
      document,
      position,
    )

    // Parse and Get new tokens
    const tokens = this.getNewTokensIncrementally(
      beforeText,
      tokenText,
      afterText,
    )

    console.log(`[FsqlCompletionItemProvider] - Completed in ${new Date().getTime() - start}ms.`)
    return tokens.map(at => new vscode.CompletionItem(at))
  }

  private getNewTokensIncrementally(
    beforeText: string,
    tokenText: string,
    afterText: string,
  ): string[] {
    let acceptedTokens = FsqlCompletionItemProvider.tryTokens(
      this.grammar,
      this.characterTokens,
      beforeText,
      afterText,
    )
    if (acceptedTokens.length > 0 && /[a-zA-Z]+/.test(tokenText)) {
      const results = FsqlUtils.tryParseWithPlaceholder(
        this.grammar,
        beforeText,
        afterText,
      )

      if (results.length > 0) {
        const type = FsqlGrammarUtils.getPlaceholderType(results[0])!
        switch (type) {
          case 'attribute':
            return []
          case 'as':
            const typeNames = FsqlGrammarUtils.getReferencedTypeNames(results[0])

            return typeNames.reduce((acc: string[], v: string) => {
              const names = FsqlCompletionItemProvider.getSuggestedAliasNames(v)

              return acc.concat(names)
            }, [] as string[])
        }
      }

      return this.types
    }

    acceptedTokens = FsqlCompletionItemProvider.tryTokens(
      this.grammar,
      this.numericTokens,
      beforeText,
      afterText,
    )
    if (acceptedTokens.length > 0) {
      return acceptedTokens
    }

    acceptedTokens = FsqlCompletionItemProvider.tryTokens(
      this.grammar,
      this.keywordTokens,
      beforeText,
      afterText,
    )
    if (acceptedTokens.length > 0) {
      return acceptedTokens
    }

    return []
  }

  private static tryTokens(
    grammar: Grammar,
    trialTokens: string[],
    beforeText: string,
    afterText: string,
  ) {
    const parser = new Parser(grammar)

    parser.feed(beforeText)
    parser.feed(' ')
    const state = parser.save()

    return trialTokens.filter(tt => {
      try {
        parser.restore(state)

        parser.feed(tt)
        parser.feed(' ')

        parser.feed(afterText)
        parser.feed(' ')

        parser.finish()
      } catch (e) {
        // console.log(e)

        return false
      }

      return true
    })
  }

  private static getSuggestedAliasNames(name: string): string[] {
    const regExp = /[A-Z]/g
    const matches = name.match(regExp)

    if (matches) {
      return [
        `AS ${matches.join('').toLowerCase()}`,
        matches.join('').toLowerCase(),
      ]
    }

    return []
  }

}
