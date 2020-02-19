import * as Papa from 'papaparse'
import * as vscode from 'vscode'

export namespace VscodeUtils {
  function ncrDecode(str: string) {
    str = str.replace(/(&#)(\d{1,6});/gi, function($0) {
      return String.fromCharCode(
        parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, '$2')),
      )
    })
    str = str.replace(/(&#x)(\w{1,4});/gi, function($0) {
      return String.fromCharCode(
        parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, '$2'), 16),
      )
    })
    return str
  }

  export function getSelectedTextOrDocumentText(editor: vscode.TextEditor) {
    let selection = editor.selection
    if (selection.isEmpty) {
      return editor.document.getText()
    }

    return editor.document.getText(selection)
  }

  export async function withProgress(promise: Promise<any>, title: string) {
    return vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: title,
        cancellable: false,
      },
      progress => {
        progress.report({
          increment: 30,
        })

        return promise
      },
    )
  }

  export async function openCsvWindow(
    headers: string[],
    resultList: string[][],
    fileName?: string,
  ) {
    const uri = vscode.Uri.parse(
      `memfs:/${fileName ? fileName : new Date().toISOString() + '.csv'}`,
    )

    const csv = Papa.unparse([headers, ...resultList])
    const decodedCsv = ncrDecode(csv)

    await vscode.workspace.fs.writeFile(uri, Buffer.from(decodedCsv))
    const document = await vscode.workspace.openTextDocument(uri)

    await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside)
  }

  export async function openTxtWindow(txt: string, fileName?: string) {
    const uri = vscode.Uri.parse(
      `memfs:/${fileName ? fileName : new Date().toISOString() + '.txt'}`,
    )

    await vscode.workspace.fs.writeFile(uri, Buffer.from(txt))
    const document = await vscode.workspace.openTextDocument(uri)

    await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside)
  }
}
