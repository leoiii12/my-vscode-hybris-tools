import * as traverse from 'traverse'
import { FSQL_PLACEHOLDER } from './fsql-completion-item-provider'

export namespace FsqlGrammarUtils {
  export function isAlias(parsingResult: any) {
    let is = false

    traverse(parsingResult).forEach(function(v) {
      if (this.key === 'as' && v !== null && 'value' in v && v.value === FSQL_PLACEHOLDER) {
        is = true
      }
    })

    return is
  }

  export function getReferencedTypeNames(parsingResult: any): string[] {
    const types = traverse(parsingResult).reduce(function(acc, v) {
      if (this.key === 'typeName') {
        acc.push(v.value)
      }

      return acc
    }, [])

    return types
  }
}
