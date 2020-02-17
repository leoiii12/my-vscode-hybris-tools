import * as traverse from 'traverse'
import { FsqlUtils } from './fsql-utils'

export namespace FsqlGrammarUtils {
  export function getPlaceholderType(parsingResultWithPlaceholder: any) {
    let type: string | undefined = undefined

    traverse(parsingResultWithPlaceholder).forEach(function(v) {
      if (
        v !== null &&
        typeof v === 'object' &&
        'value' in v &&
        v.value === FsqlUtils.FSQL_PLACEHOLDER
      ) {
        type = `${this.key}`

        this.stop()
      }
    })

    return type
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
