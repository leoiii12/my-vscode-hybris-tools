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
    if (context.triggerCharacter === '.') {
      return []
    }
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
      console.log(
        `[FsqlCompletionAttributeItemProvider] - Completed in ${new Date().getTime() -
          start}ms.`,
      )
      return []
    }

    const type = FsqlGrammarUtils.getPlaceholderType(results[0])!
    switch (type) {
      case 'attribute':
        const attributes = await this.getAttributes('HktvVariantProduct')
        const items = attributes.map(at => {
          const ci = new vscode.CompletionItem(
            at.qualifier,
            vscode.CompletionItemKind.Field,
          )
          ci.detail = `${at.typeCode}`
          return ci
        })

        console.log(
          `[FsqlCompletionAttributeItemProvider] - Completed in ${new Date().getTime() -
            start}ms.`,
        )
        return items
    }

    console.log(
      `[FsqlCompletionAttributeItemProvider] - Completed in ${new Date().getTime() -
        start}ms.`,
    )
    return []
  }

  private async getAttributes(
    composedTypeCode: string,
  ): Promise<{ qualifier: string; typeCode: string }[]> {
    if (composedTypeCode in this.cachedTypes) {
      return this.cachedTypes[composedTypeCode]
    }

    const groovy = this.getAttributesGroovy.replace(
      '$_COMPOSED_TYPE',
      composedTypeCode,
    )
    const execResult = await this.hacUtils.executeGroovy(false, groovy)
    const attributes = JSON.parse(execResult.executionResult)

    this.cachedTypes[composedTypeCode] = attributes

    return attributes
  }

  private getAttributesGroovy: string = `
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
}
