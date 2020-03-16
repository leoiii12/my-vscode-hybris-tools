import { Rules } from 'moo'
import { Grammar, Parser } from 'nearley'
import * as vscode from 'vscode'

import { Hac } from '../hac'
import { InternalCaches } from '../internal-caches'
import { FsqlGrammarUtils } from './internal/fsql-grammar-utils'
import { FsqlUtils } from './internal/fsql-utils'

export class FsqlDefinitionProvider implements vscode.DefinitionProvider {
  constructor(
    private grammar: Grammar,
    private caches: InternalCaches,
    private hac: Hac,
    private lexerRules: Rules,
  ) {}

  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): Promise<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {
    const { beforeText, afterText, tokenText } = FsqlUtils.getBeforeAfterTexts(
      document,
      position,
      this.lexerRules,
    )

    const resultsWithPlaceholder = FsqlUtils.tryParseWithPlaceholder(
      this.grammar,
      beforeText,
      afterText,
    )
    if (resultsWithPlaceholder.length === 0) {
      return []
    }

    const node = FsqlGrammarUtils.getPlaceholderNode(resultsWithPlaceholder[0])
    if (node === undefined) {
      return []
    }

    switch (node.type) {
      case 'typeName':
        const typeCode = this.caches.fsqlComposedTypeCodes.find(
          c => c.toLowerCase() === tokenText.toLowerCase(),
        )
        if (typeCode === undefined) {
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

        const referencedTypes = FsqlGrammarUtils.getTypes(parser.results[0])

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
}
