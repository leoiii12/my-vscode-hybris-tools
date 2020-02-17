import * as traverse from 'traverse'
import { FsqlUtils } from './fsql-utils'

export namespace FsqlGrammarUtils {
  export function getType(parsingResultWithPlaceholder: any) {
    let type: string | undefined = undefined

    traverse(parsingResultWithPlaceholder).forEach(function(v) {
      if (
        v !== null &&
        'value' in v &&
        v.value === FsqlUtils.FSQL_PLACEHOLDER
      ) {
        let parentNode = this.parent

        // TODO
        type = 'identifier'
      }
    })

    return type
  }

  export function isAlias(parsingResultWithPlaceholder: any) {
    let is = false

    traverse(parsingResultWithPlaceholder).forEach(function(v) {
      if (
        this.key === 'as' &&
        v !== null &&
        'value' in v &&
        v.value === FsqlUtils.FSQL_PLACEHOLDER
      ) {
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
