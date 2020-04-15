import { Rules } from 'moo'
import { Grammar, Parser } from 'nearley'
import * as vscode from 'vscode'

import { InternalCaches } from '../internal-caches'
import { FsqlGrammarUtils } from './internal/fsql-grammar-utils'
import { FsqlUtils } from './internal/fsql-utils'

export class FsqlCompletionItemProvider
  implements vscode.CompletionItemProvider {
  private characterTokens = ['a']
  private numericTokens = ['0']
  private keywordTokens = [
    'GROUP BY',
    'ORDER BY',

    'TRUE',
    'FALSE',
    'NULL',

    'SELECT',
    'FROM',
    'WHERE 1 = 1',
    'HAVING 1 = 1',
    'UNION',
    'ALL',
    'EXCEPT',
    'MINUS',
    'INTERSECT',

    'ALL',
    'ASC',
    'DESC',
    'NULLS',
    'FIRST',
    'LAST',

    'LEFT JOIN placeholder',
    'LEFT JOIN placeholder AS p',
    'JOIN placeholder',
    'JOIN placeholder AS p',
    'ON 1 = 1',

    'AND 1 = 1',
    'OR 1 = 1',
    'NOT',
    'NOT LIKE',
    'NOT BETWEEN',
    'NOT EXISTS',
    'IS NOT',
    'NOT IN',
    'LIKE',
    'BETWEEN',
    'EXISTS',
    'IS',
    'IN',

    'CASE',
    'WHEN',
    'THEN',
    'ELSE',
    'END',

    'AS placeholder',
  ]
  private keywordTokensInsertText: {
    [keywordToken: string]: { label: string; snippetString: string }
  } = {
    'WHERE 1 = 1': {
      label: 'WHERE',
      snippetString: 'WHERE ${1:1} = ${2:1}',
    },
    'LEFT JOIN placeholder': {
      label: 'LEFT JOIN',
      snippetString: 'LEFT JOIN ${1:placeholder}',
    },
    'LEFT JOIN placeholder AS p': {
      label: 'LEFT JOIN AS',
      snippetString: 'LEFT JOIN ${1:placeholder} AS ${2:p}',
    },
    'JOIN placeholder': {
      label: 'JOIN',
      snippetString: 'JOIN ${1:placeholder}',
    },
    'JOIN placeholder AS p': {
      label: 'JOIN AS',
      snippetString: 'JOIN ${1:placeholder} AS ${2:p}',
    },
    'ON 1 = 1': {
      label: 'ON',
      snippetString: 'ON ${1:1} = ${2:1}',
    },
    'AS placeholder': {
      label: 'AS',
      snippetString: 'AS ${1:placeholder}',
    },
    'AND 1 = 1': {
      label: 'AND',
      snippetString: 'AND ${1:1} = ${2:1}',
    },
    'OR 1 = 1': {
      label: 'OR',
      snippetString: 'OR ${1:1} = ${2:1}',
    },
  }

  constructor(
    private grammar: Grammar,
    private caches: InternalCaches,
    private lexerRules: Rules,
  ) {}

  public provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    cancellationToken: vscode.CancellationToken,
    context: vscode.CompletionContext,
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const start = new Date().getTime()

    const { beforeText, tokenText, afterText } = FsqlUtils.getBeforeAfterTexts(
      document,
      position,
      this.lexerRules,
    )

    // Parse and Get new tokens
    const tokens = this.getPossibleTokensIncrementally(
      beforeText,
      tokenText,
      afterText,
    )

    console.log(
      `[FsqlCompletionItemProvider] - ` +
        `Completed in ${new Date().getTime() - start}ms.`,
    )
    return tokens.map(at => {
      const completionItem = new vscode.CompletionItem(at)

      if (at in this.keywordTokensInsertText) {
        completionItem.label = this.keywordTokensInsertText[at].label
        completionItem.insertText = new vscode.SnippetString(
          this.keywordTokensInsertText[at].snippetString,
        )
        completionItem.kind = vscode.CompletionItemKind.Snippet
      }

      return completionItem
    })
  }

  private getPossibleTokensIncrementally(
    beforeText: string,
    tokenText: string,
    afterText: string,
  ): string[] {
    const getPossibleCharacterTokens = (): string[] => {
      let acceptedTokens = FsqlCompletionItemProvider.tryTokens(
        this.grammar,
        this.characterTokens,
        beforeText,
        afterText,
      )
      if (acceptedTokens.length === 0) {
        return []
      }

      const results = FsqlUtils.tryParseWithPlaceholder(
        this.grammar,
        beforeText,
        afterText,
      )
      if (results.length === 0) {
        console.log(
          '[getPossibleTokensIncrementally] - The syntax of the fsql may be wrong. Not able to parse.',
        )
        return []
      }

      const parsingResultWithPlaceholder = results[0]

      const node = FsqlGrammarUtils.getPlaceholderNode(
        parsingResultWithPlaceholder,
      )

      switch (node.type) {
        case 'attribute':
        case 'language':
        case 'modifiers':
        case 'column':
          // This is handled by FsqlCompletionAttributeItemProvider
          return []
        case 'as':
          const types = FsqlGrammarUtils.getTypes(parsingResultWithPlaceholder)

          return types.reduce((acc: string[], v) => {
            const names = FsqlCompletionItemProvider.getSuggestedAliasNames(
              v.typeName.value,
            )

            return acc.concat(names)
          }, [] as string[])
        default:
          return this.caches.fsqlComposedTypeCodes
      }
    }

    const getKeywordTokens = (): string[] => {
      const acceptedTokens = FsqlCompletionItemProvider.tryTokens(
        this.grammar,
        this.keywordTokens,
        beforeText,
        afterText,
      )
      if (acceptedTokens.length === 0) {
        return []
      }

      return acceptedTokens
    }

    const getNumericTokens = (): string[] => {
      const acceptedTokens = FsqlCompletionItemProvider.tryTokens(
        this.grammar,
        this.numericTokens,
        beforeText,
        afterText,
      )
      if (acceptedTokens.length === 0) {
        return []
      }

      return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    }

    const acceptedTokens = [
      ...getPossibleCharacterTokens(),
      ...getKeywordTokens(),
      ...getNumericTokens(),
    ]

    return acceptedTokens
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
    const matchArr = name.match(regExp)

    if (matchArr) {
      return [
        // `AS ${matchArr.join('').toLowerCase()}`,
        matchArr.join('').toLowerCase(),
      ]
    }

    return []
  }
}
