import { Rules } from 'moo'
import { Grammar } from 'nearley'
import * as vscode from 'vscode'

import { Hac } from '../hac'
import { InternalCaches } from '../internal-caches'
import { FsqlGrammarUtils } from './internal/fsql-grammar-utils'
import { FsqlUtils } from './internal/fsql-utils'

export class FsqlCompletionAttributeItemProvider
  implements vscode.CompletionItemProvider {
  constructor(
    private grammar: Grammar,
    private hac: Hac,
    private caches: InternalCaches,
    private lexerRules: Rules,
  ) {}

  public async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    cancellationToken: vscode.CancellationToken,
    context: vscode.CompletionContext,
  ): Promise<vscode.CompletionItem[]> {
    return vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: 'Loading...',
      },
      async progress => {
        progress.report({ increment: 0 })

        return this.getCompletionItems(document, position, context)
      },
    )
  }

  public async getCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.CompletionContext,
  ) {
    const start = new Date().getTime()

    const { beforeText, afterText } = FsqlUtils.getBeforeAfterTexts(
      document,
      position,
      this.lexerRules,
    )

    const results = FsqlUtils.tryParseWithPlaceholder(
      this.grammar,
      context.triggerCharacter !== undefined &&
        '.:[]'.includes(context.triggerCharacter) === true
        ? beforeText + context.triggerCharacter
        : beforeText,
      afterText,
    )
    if (results.length === 0) {
      return []
    }

    const parsingResultWithPlaceholder = results[0]

    const node = FsqlGrammarUtils.getPlaceholderNode(
      parsingResultWithPlaceholder,
    )
    const parentNode = FsqlGrammarUtils.getPlaceholderParentNode(
      parsingResultWithPlaceholder,
    )

    switch (node.type) {
      // Type
      case 'attribute': {
        if ('typeAlias' in parentNode === false) {
          return []
        }

        let typeAlias = parentNode['typeAlias']

        const types = FsqlGrammarUtils.getTypes(parsingResultWithPlaceholder)
        if (typeAlias === null) {
          // No type def yet
          if (types.length === 0) {
            return []
          }
          // The only-default type
          else if (types.length === 1) {
            typeAlias = types[0].typeName
          }
          // More than one type
          else if (types.length > 1) {
            return types.reduce((acc, v) => {
              acc.push(
                new vscode.CompletionItem(
                  v.typeName.toString(),
                  vscode.CompletionItemKind.Class,
                ),
              )
              if (v.as !== undefined) {
                acc.push(
                  new vscode.CompletionItem(
                    v.as.toString(),
                    vscode.CompletionItemKind.Variable,
                  ),
                )
              }

              return acc
            }, [] as vscode.CompletionItem[])
          }
        }

        const type = await FsqlCompletionAttributeItemProvider.getConcreteTypeCode(
          typeAlias.toString(),
          parsingResultWithPlaceholder,
        )
        if (type === undefined) {
          return []
        }

        const attributes = await this.getComposedTypeAttributes(
          type.typeName.value,
        )
        const items = attributes.map(at => {
          const ci = new vscode.CompletionItem(
            at.qualifier,
            vscode.CompletionItemKind.Field,
          )
          ci.detail = `${at.typeCode}`
          return ci
        })

        console.log(
          '[FsqlCompletionAttributeItemProvider] - ' +
            `Completed in ${new Date().getTime() - start}ms.`,
        )

        return items
      }
      case 'language':
        return ['zh', 'en'].map(lang => {
          const ci = new vscode.CompletionItem(
            lang,
            vscode.CompletionItemKind.Field,
          )
          return ci
        })
      case 'modifiers':
        return ['o'].map(lang => {
          const ci = new vscode.CompletionItem(
            lang,
            vscode.CompletionItemKind.Field,
          )
          return ci
        })

      // Table
      case 'column': {
        if ('tableAlias' in parentNode === false) {
          return []
        }

        const tableAlias = parentNode['tableAlias'].toString()

        const subqueries = FsqlGrammarUtils.getSubqueries(
          parsingResultWithPlaceholder,
        )

        const matchedSubquery = subqueries.find(
          sq => sq.as?.value === tableAlias,
        )
        if (matchedSubquery === undefined) {
          return []
        }

        const selects = FsqlGrammarUtils.getSelects(
          parsingResultWithPlaceholder,
        )

        return selects
          .filter(t => t.path.startsWith(matchedSubquery.path))
          .map((s, i) => {
            let label = s['as']?.value
            if (label === undefined) {
              if (s.term['type'] === 'column_ref') {
                label = s.term['attribute'].value || s.term['column'].value
              } else {
                label = s.term
              }
            }
            const ci = new vscode.CompletionItem(
              label!,
              vscode.CompletionItemKind.Field,
            )
            ci.sortText = `${i}`
            return ci
          })
          .filter((v, i, a) => a.findIndex(e => e.label === v.label) === i)
      }
    }

    return []
  }

  /**
   * Get all attributes of a composed type
   * @param composedTypeCode
   */
  private async getComposedTypeAttributes(
    composedTypeCode: string,
  ): Promise<{ qualifier: string; typeCode: string }[]> {
    if (composedTypeCode in this.caches.fsqlComposedTypeAttributes) {
      return this.caches.fsqlComposedTypeAttributes[composedTypeCode]
    }

    const getAttributesGroovy: string = `
      import com.google.gson.JsonObject
      import de.hybris.platform.core.model.type.AttributeDescriptorModel
      import de.hybris.platform.core.model.type.ComposedTypeModel

      def typeService = spring.getBean('typeService')

      try {
        ComposedTypeModel typeModel = typeService.getComposedTypeForCode("$_COMPOSED_TYPE")
        if (null != typeModel) {
            def attributes = new HashSet<AttributeDescriptorModel>()
            attributes.addAll(typeModel.getInheritedattributedescriptors())
            attributes.addAll(typeModel.getDeclaredattributedescriptors())

            return attributes
                    .stream()
                    .map {
                        JsonObject jsonObject = new JsonObject();
                        jsonObject.addProperty("qualifier", it.getQualifier())
                        jsonObject.addProperty("typeCode", it.getAttributeType().getCode())
                        jsonObject.addProperty("extensionName", it.getExtensionName())
                        jsonObject.addProperty("databaseColumn", it.getDatabaseColumn().toString())
                        jsonObject
                    }
                    .sorted(Comparator.comparing { it -> it.getAt("extensionName").hashCode() })
                    .collect()
          }

        return []
      } catch (Exception e) {
        return []
      }
    `

    const groovy = getAttributesGroovy.replace(
      '$_COMPOSED_TYPE',
      composedTypeCode,
    )
    const execResult = await this.hac.executeGroovy(false, groovy)
    const attributes = JSON.parse(execResult.executionResult)

    this.caches.fsqlComposedTypeAttributes[composedTypeCode] = attributes

    return attributes
  }

  /**
   * Convert the alias to the concrete type
   * @param typeAlias
   * @param parsingResult
   */
  private static async getConcreteTypeCode(
    typeAlias: string,
    parsingResult: any,
  ) {
    const referencedTypes = FsqlGrammarUtils.getTypes(parsingResult)

    for (const type of referencedTypes) {
      if (type.as && type.as.value === typeAlias) {
        return type
      } else if (type.typeName && type.typeName.value === typeAlias) {
        return type
      }
    }

    return undefined
  }
}
