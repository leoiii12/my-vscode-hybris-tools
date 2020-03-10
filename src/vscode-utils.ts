import * as Papa from 'papaparse'
import * as vscode from 'vscode'
import { writeFileSync, mkdirSync } from 'fs'
import { tmpdir } from 'os'

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
    const csv = Papa.unparse([headers, ...resultList])
    const decodedCsv = ncrDecode(csv)

    const dir = `${tmpdir}/my-vscode-hybris-tools/csv`
    const path = `${dir}/${fileName ? fileName : new Date().getTime() + '.csv'}`

    mkdirSync(dir, { recursive: true })
    writeFileSync(path, Buffer.from(decodedCsv))

    const uri = vscode.Uri.file(path)
    const document = await vscode.workspace.openTextDocument(uri)

    await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside)
  }

  export async function openTxtWindow(txt: string, fileName?: string) {
    const dir = `${tmpdir}/my-vscode-hybris-tools/txt`
    const path = `${dir}/${fileName ? fileName : new Date().getTime() + '.txt'}`

    mkdirSync(dir, { recursive: true })
    writeFileSync(path, Buffer.from(txt))

    const uri = vscode.Uri.file(path)
    const document = await vscode.workspace.openTextDocument(uri)

    await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside)
  }
}
