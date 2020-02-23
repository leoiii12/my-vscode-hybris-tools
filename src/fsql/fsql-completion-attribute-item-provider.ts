import { Grammar } from 'nearley'
import * as vscode from 'vscode'

import { HacUtils } from '../hac-utils'
import { InternalCaches } from '../internal-caches'
import { FsqlGrammarUtils } from './fsql-grammar-utils'
import { FsqlUtils } from './fsql-utils'

export class FsqlCompletionAttributeItemProvider
  implements vscode.CompletionItemProvider {
  constructor(
    private grammar: Grammar,
    private hacUtils: HacUtils,
    private caches: InternalCaches,
  ) {}

  public async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    cancellationToken: vscode.CancellationToken,
    context: vscode.CompletionContext,
  ): Promise<vscode.CompletionItem[]> {
    const start = new Date().getTime()

    const { beforeText, afterText } = FsqlUtils.getBeforeAfterTexts(
      document,
      position,
    )

    const results = FsqlUtils.tryParseWithPlaceholder(
      this.grammar,
      context.triggerCharacter && beforeText.endsWith(context.triggerCharacter)
        ? beforeText
        : beforeText + context.triggerCharacter,
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
    console.log(parentNode)
    switch (node.type) {
      case 'attribute': {
        const matchedRet = FsqlUtils.matchesByKeys(parentNode, [
          { keysToHave: ['typeAlias'], ret: 'Type' },
          { keysToHave: ['tableAlias'], ret: 'Table' },
          { keysToHave: ['*'], ret: '*' },
        ])
        switch (matchedRet) {
          case 'Type':
            const typeAlias = parentNode['typeAlias'].toString()

            const type = await FsqlCompletionAttributeItemProvider.getConcreteTypeCode(
              typeAlias,
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
          default:
            console.log(
              `[FsqlCompletionAttributeItemProvider] - Not yet implemented for ${matchedRet}.`,
            )
            break
        }

        break
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
      default:
        return []
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
      import de.hybris.platform.core.model.type.ComposedTypeModel
      import de.hybris.platform.core.model.type.AttributeDescriptorModel
      import java.util.HashSet
      import com.google.gson.JsonObject

      def typeService = spring.getBean("typeService")

      try {
        ComposedTypeModel typeModel = typeService.getComposedTypeForCode("$_COMPOSED_TYPE")
        if (null != typeModel)
        {
            def attributes = new HashSet<AttributeDescriptorModel>()
            attributes.addAll(typeModel.getInheritedattributedescriptors())
            attributes.addAll(typeModel.getDeclaredattributedescriptors())

            return attributes
                    .stream()
                    .map {
                        JsonObject jsonObject = new JsonObject();
                        jsonObject.addProperty("qualifier", it.getQualifier())
                        jsonObject.addProperty("typeCode", it.getAttributeType().getCode())
                        jsonObject
                    }
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
    const execResult = await this.hacUtils.executeGroovy(false, groovy)
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
    const referencedTypes = FsqlGrammarUtils.getReferencedTypes(parsingResult)

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
