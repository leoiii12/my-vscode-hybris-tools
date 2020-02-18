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

  export function getPlaceholderColumnRef(
    parsingResultWithPlaceholder: any,
  ): any {
    let columnRef: any = undefined

    traverse(parsingResultWithPlaceholder).forEach(function(v) {
      if (
        v !== null &&
        typeof v === 'object' &&
        'value' in v &&
        v.value === FsqlUtils.FSQL_PLACEHOLDER
      ) {
        const parentNode = this.parent!.node
        if ('type' in parentNode && parentNode['type'] === 'column_ref') {
          columnRef = parentNode
        }

        this.stop()
      }
    })

    return columnRef
  }

  export function getReferencedTypes(
    parsingResult: any,
  ): { typeName: moo.Token; as: moo.Token | undefined }[] {
    const types = traverse(parsingResult).reduce(function(acc, v) {
      if (this.key !== 'typeName') {
        return acc
      }
      if (v === undefined || v === null) {
        return acc
      }

      const parentNode = this.parent!.node
      if (
        parentNode.type === 'single_type_clause' &&
        'as' in parentNode &&
        parentNode['as']
      ) {
        acc.push({ typeName: v, as: parentNode['as'] })
      } else {
        acc.push({ typeName: v, as: undefined })
      }

      return acc
    }, [])

    return types
  }
}
