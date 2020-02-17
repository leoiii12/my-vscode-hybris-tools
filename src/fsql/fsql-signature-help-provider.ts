import * as vscode from 'vscode'
import { HacUtils } from '../hac-utils'
import { FsqlUtils } from './fsql-utils'
import { Grammar } from 'nearley'

export class FsqlSignatureHelpProvider implements vscode.SignatureHelpProvider {
  constructor(private grammar: Grammar, private hacUtils: HacUtils) {}

  public async provideSignatureHelp(
    document: vscode.TextDocument,
    position: vscode.Position,
    cancellationToken: vscode.CancellationToken,
  ): Promise<vscode.SignatureHelp> {
    const text = document.getText()
    const beforeRange = new vscode.Range(document.positionAt(0), position)
    const afterRange = new vscode.Range(
      document.positionAt(document.offsetAt(position) + 1),
      document.positionAt(text.length),
    )
    const beforeText = document.getText(beforeRange)
    const afterText = document.getText(afterRange)

    const groovy = this.getAttributesGroovy.replace(
      '$_COMPOSED_TYPE',
      'HktvVariantProduct',
    )
    const execResult = await this.hacUtils.executeGroovy(false, groovy)
    const attributes = JSON.parse(execResult.executionResult)

    console.log(attributes)

    const signatureHelp = new vscode.SignatureHelp()

    return signatureHelp
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
