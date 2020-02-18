import * as vscode from 'vscode'
import { FsqlUtils } from './fsql-utils'
import { InternalCaches } from '../internal-caches'
import { Grammar, Parser } from 'nearley'
import { FsqlGrammarUtils } from './fsql-grammar-utils'
import { HacUtils } from '../hac-utils'

export class FsqlDefinitionProvider implements vscode.DefinitionProvider {
  constructor(
    private grammar: Grammar,
    private caches: InternalCaches,
    private hacUtils: HacUtils,
  ) {}

  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): Promise<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {
    const { beforeText, afterText, tokenText } = FsqlUtils.getBeforeAfterText(
      document,
      position,
    )

    const resultsWithPlaceholder = FsqlUtils.tryParseWithPlaceholder(
      this.grammar,
      beforeText,
      afterText,
    )
    if (resultsWithPlaceholder.length === 0) {
      return []
    }

    const type = FsqlGrammarUtils.getPlaceholderType(resultsWithPlaceholder[0])
    if (type === undefined) {
      return []
    }

    switch (type) {
      case 'typeName':
        if (this.caches.fsqlComposedTypeCodes.includes(tokenText) === false) {
          return []
        }

        const uri = vscode.Uri.parse(`memfs:/${tokenText}.attributes.json`)

        const attributes = await this.getComposedTypeAttributes(tokenText)
        const json = JSON.stringify(attributes, undefined, 2)
        await vscode.workspace.fs.writeFile(uri, Buffer.from(json))

        const numOfLines = json.split('\n').length

        return [
          new vscode.Location(
            uri,
            new vscode.Range(
              new vscode.Position(0, 0),
              new vscode.Position(numOfLines, 0),
            ),
          ),
        ]
      case 'typeAlias':
        const parser = new Parser(this.grammar)
        parser.feed(document.getText())
        parser.finish()

        const referencedTypes = FsqlGrammarUtils.getReferencedTypes(
          parser.results[0],
        )

        const selectedType = referencedTypes.find(
          rt =>
            rt.typeName.value === tokenText ||
            (rt.as && rt.as.value === tokenText),
        )
        if (selectedType === undefined) {
          return []
        }

        return [
          new vscode.Location(
            document.uri,
            new vscode.Range(
              document.positionAt(selectedType.typeName.offset),
              document.positionAt(
                selectedType.typeName.offset +
                  selectedType.typeName.text.length,
              ),
            ),
          ),
        ]
    }

    return []
  }

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
        ComposedTypeModel typeModel = typeService.getComposedTypeForCode("HktvVariantProduct")
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
    const execResult = await this.hacUtils.executeGroovy(false, groovy)
    const attributes = JSON.parse(execResult.executionResult)

    this.caches.fsqlComposedTypeAttributes[composedTypeCode] = attributes

    return attributes
  }
}
