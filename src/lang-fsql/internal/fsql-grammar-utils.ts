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

  export function getTypes(
    parsingResult: any,
  ): { typeName: moo.Token; as: moo.Token | undefined; path: string }[] {
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
        acc.push({
          typeName: v,
          as: parentNode['as'],
          path: this.path.join(','),
        })
      } else {
        acc.push({ typeName: v, as: undefined, path: this.path.join(',') })
      }

      return acc
    }, [])

    return types
  }

  export function getSubqueries(
    parsingResult: any,
  ): { subquery: moo.Token; as: moo.Token | undefined; path: string }[] {
    const types = traverse(parsingResult).reduce(function(acc, v) {
      if (this.key !== 'subquery') {
        return acc
      }
      if (v === undefined || v === null) {
        return acc
      }

      const parentNode = this.parent!.node
      if (
        parentNode.type === 'table_expression' &&
        'as' in parentNode &&
        parentNode['as']
      ) {
        acc.push({
          subquery: v,
          as: parentNode['as'],
          path: this.path.join(','),
        })
      } else {
        acc.push({ subquery: v, as: undefined, path: this.path.join(',') })
      }

      return acc
    }, [])

    return types
  }

  export function getSelects(
    parsingResult: any,
  ): { term: any; as: moo.Token | undefined; path: string }[] {
    const types = traverse(parsingResult).reduce(function(acc, v) {
      if (this.key !== 'term') {
        return acc
      }
      if (v === undefined || v === null) {
        return acc
      }

      // This will skip all `*` expression
      const parentNode = this.parent!.node
      if (
        parentNode.type === 'select_expression' &&
        'as' in parentNode &&
        parentNode['as']
      ) {
        acc.push({ term: v, as: parentNode['as'], path: this.path.join(',') })
      } else {
        acc.push({ term: v, as: undefined, path: this.path.join(',') })
      }

      return acc
    }, [])

    return types
  }
}
