import * as traverse from 'traverse'

import { FsqlUtils } from './fsql-utils'

export namespace FsqlGrammarUtils {
  export function getPlaceholderNode(parsingResultWithPlaceholder: any) {
    let node: any = undefined

    traverse(parsingResultWithPlaceholder).forEach(function(v) {
      if (
        v !== null &&
        typeof v === 'object' &&
        'value' in v &&
        v.value === FsqlUtils.FSQL_PLACEHOLDER
      ) {
        node = this.node
        node.type = this.key

        this.stop()
      }
    })

    return node
  }

  export function getPlaceholderParentNode(parsingResultWithPlaceholder: any) {
    let parentNode: any = undefined

    traverse(parsingResultWithPlaceholder).forEach(function(v) {
      if (
        v !== null &&
        typeof v === 'object' &&
        'value' in v &&
        v.value === FsqlUtils.FSQL_PLACEHOLDER
      ) {
        parentNode = this.parent!.node
        parentNode.type = this.parent!.key

        this.stop()
      }
    })

    return parentNode
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
