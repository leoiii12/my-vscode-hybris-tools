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
  ): { typeName: string; as: string | undefined }[] {
    const types = traverse(parsingResult).reduce(function(acc, v) {
      if (this.key !== 'typeName') {
        return acc
      }

      const parentNode = this.parent?.node
      if (
        parentNode &&
        parentNode.type === 'single_type_clause' &&
        'as' in parentNode &&
        parentNode['as']
      ) {
        acc.push({ typeName: v.value, as: parentNode['as'].value })
      } else {
        acc.push({ typeName: v.value, as: undefined })
      }

      return acc
    }, [])

    return types
  }
}
