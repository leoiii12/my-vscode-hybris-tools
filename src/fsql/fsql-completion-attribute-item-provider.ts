import * as vscode from 'vscode'
import { CompletionContext } from 'vscode'
import { Grammar } from 'nearley'
import { HacUtils } from '../hac-utils'
import { FsqlGrammarUtils } from './fsql-grammar-utils'
import { FsqlUtils } from './fsql-utils'

export class FsqlCompletionAttributeItemProvider
  implements vscode.CompletionItemProvider {
  private cachedTypes: {
    [compoedTypeCode: string]: { qualifier: string; typeCode: string }[]
  } = {}

  constructor(private grammar: Grammar, private hacUtils: HacUtils) {}

  public async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    cancellationToken: vscode.CancellationToken,
    context: CompletionContext,
  ): Promise<vscode.CompletionItem[]> {
    if (document.languageId !== 'flexibleSearchQuery') {
      return []
    }

    const start = new Date().getTime()

    const { beforeText, afterText } = FsqlUtils.getBeforeAfterText(
      document,
      position,
    )

    const results = FsqlUtils.tryParseWithPlaceholder(
      this.grammar,
      beforeText.endsWith('.') ? beforeText : beforeText + '.',
      afterText,
    )
    if (results.length === 0) {
      return []
    }

    const parsingResultWithPlaceholder = results[0]

    const type = FsqlGrammarUtils.getPlaceholderType(
      parsingResultWithPlaceholder,
    )!
    if (type !== 'attribute') {
      return []
    }

    const columnRef = FsqlGrammarUtils.getPlaceholderColumnRef(
      parsingResultWithPlaceholder,
    )

    const matchedRet = FsqlUtils.matchesByPatterns(columnRef, [
      { pattern: ['typeAlias'], ret: 'Type' },
      { pattern: ['tableAlias'], ret: 'Table' },
      { pattern: ['*'], ret: '*' },
    ])
    switch (matchedRet) {
      case 'Type':
        const typeAlias = columnRef['typeAlias'].toString()

        const type = await FsqlCompletionAttributeItemProvider.getActualTypeName(
          typeAlias,
          parsingResultWithPlaceholder,
        )
        if (type === undefined) {
          return []
        }

        const attributes = await this.getComposedTypeAttributes(type.typeName)
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

    return []
  }

  private async getComposedTypeAttributes(
    composedTypeCode: string,
  ): Promise<{ qualifier: string; typeCode: string }[]> {
    if (composedTypeCode in this.cachedTypes) {
      return this.cachedTypes[composedTypeCode]
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

    this.cachedTypes[composedTypeCode] = attributes

    return attributes
  }

  private static async getActualTypeName(
    typeAlias: string,
    parsingResult: any,
  ) {
    const referencedTypes = FsqlGrammarUtils.getReferencedTypes(parsingResult)

    for (const type of referencedTypes) {
      if (type.as === typeAlias) {
        return type
      } else if (type.typeName === typeAlias) {
        return type
      }
    }

    return undefined
  }
}
