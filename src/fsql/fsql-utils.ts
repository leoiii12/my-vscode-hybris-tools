import * as moo from 'moo'
import { Grammar, Parser } from 'nearley'
import * as vscode from 'vscode'

import { lexerRules } from './fsql-lexer'

export namespace FsqlUtils {
  export const FSQL_PLACEHOLDER = 'FsqlPlaceholder'

  export function getBeforeAfterTexts(
    document: vscode.TextDocument,
    position: vscode.Position,
  ) {
    const text = document.getText()
    const offset = document.offsetAt(position)

    const lexer = moo.compile(lexerRules)
    lexer.reset(text)

    const offsetObj = { start: 0, end: 0 }
    while (true) {
      const t = lexer.next()
      if (t === undefined) {
        break
      }

      if (t.offset <= offset && offset <= t.offset + t.text.length) {
        offsetObj.start = t.offset
        offsetObj.end = t.offset + t.text.length
        break
      }
    }

    const tokenRange = new vscode.Range(
      document.positionAt(offsetObj.start),
      document.positionAt(offsetObj.end),
    )
    const beforeRange = new vscode.Range(
      document.positionAt(0),
      tokenRange.start,
    )
    const afterRange = new vscode.Range(
      tokenRange.end,
      document.positionAt(text.length),
    )

    const beforeText = document.getText(beforeRange)
    const tokenText = document.getText(tokenRange)
    const afterText = document.getText(afterRange)

    return {
      beforeRange,
      tokenRange,
      afterRange,

      beforeText,
      afterText,
      tokenText,
    }
  }

  /**
   * The identifier positions of the returned results are different from the original document.
   * @param grammar
   * @param beforeText
   * @param afterText
   */
  export function tryParseWithPlaceholder(
    grammar: Grammar,
    beforeText: string,
    afterText: string,
  ) {
    const parser = new Parser(grammar)

    try {
      parser.feed(beforeText)
      parser.feed(' ')

      parser.feed(FSQL_PLACEHOLDER)
      parser.feed(' ')

      parser.feed(afterText)
      parser.feed(' ')

      parser.finish()

      return parser.results
    } catch (e) {
      // console.log(e)
    }

    return []
  }

  export function findLatestTokenByValue(
    lexerRules: moo.Rules,
    text: string,
    tokenValue: string,
    before?: { line: number; col: number },
  ) {
    const lexer = moo.compile(lexerRules)
    lexer.reset(text)

    let matchedToken: moo.Token | undefined
    let currToken: moo.Token | undefined
    while (true) {
      currToken = lexer.next()
      if (currToken === undefined) {
        break
      }
      if (
        before &&
        currToken.line >= before.line &&
        currToken.col >= before.col
      ) {
        break
      }

      if (currToken.text === tokenValue) {
        matchedToken = currToken
      }
    }

    return matchedToken
  }

  export function includesAllKeys(obj: any, keys: string[]) {
    return Object.keys(obj).filter(k => keys.includes(k)).length === keys.length
  }

  export function matchesByPatterns(
    obj: any,
    rules: { pattern: string[]; ret: string }[],
  ): string | undefined {
    for (const rule of rules) {
      if (includesAllKeys(obj, rule.pattern) === true) {
        return rule.ret
      }
    }

    const anyRule = rules.find(r => r.pattern.includes('*'))
    if (anyRule) {
      return anyRule.ret
    }

    return undefined
  }
}
