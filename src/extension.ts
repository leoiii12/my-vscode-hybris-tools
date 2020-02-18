// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { Grammar } from 'nearley'
import { FsqlCompletionItemProvider } from './fsql/fsql-completion-item-provider'
import { HacUtils } from './hac-utils'
import { FsqlDiagnosticProvider } from './fsql/fsql-diagnostic-provider'
import { MemFS } from './memfs'
import * as Papa from 'papaparse'
import { FsqlCompletionAttributeItemProvider } from './fsql/fsql-completion-attribute-item-provider'

const grammar = require('../syntaxes/flexibleSearchQuery.js')

export interface ParseRow {
  index: number
  states: any[]
  wants: any[]
  scannable: any[]
  completed: any
  lexerState: { line: number; col: number }
}

let diagnosticCollection: vscode.DiagnosticCollection

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "my-vscode-hybris-tools" is now active!',
  )

  const hacUtils = new HacUtils()

  /**
   * File System Provider
   */
  const memFs = new MemFS()
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider('memfs', memFs, {
      isCaseSensitive: true,
    }),
  )

  /**
   * Provide Diagnostics
   */
  const fsqlDiagnosticProvider = new FsqlDiagnosticProvider(grammar)
  diagnosticCollection = vscode.languages.createDiagnosticCollection(
    'flexibleSearchQuery',
  )
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      diagnosticCollection.set(event.document.uri, [])
      diagnosticCollection.set(
        event.document.uri,
        fsqlDiagnosticProvider.getDiagnostics(event.document),
      )
    }),
  )
  context.subscriptions.push(diagnosticCollection)

  /**
   * Show Code Completion Proposals
   */
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      'flexibleSearchQuery',
      new FsqlCompletionItemProvider(
        Grammar.fromCompiled(grammar),
        new HacUtils(),
      ),
    ),
  )
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      'flexibleSearchQuery',
      new FsqlCompletionAttributeItemProvider(
        Grammar.fromCompiled(grammar),
        new HacUtils(),
      ),
      ...['.', ':'],
    ),
  )

  /**
   * Commands
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'vscode-hybris-tools.flexibleSearchQuery.execute',
      async () => {
        const editor = vscode.window.activeTextEditor
        if (editor === undefined) {
          return
        }

        const flexQueryExecResult = await hacUtils.executeFlexibleSearch(
          100000,
          getSelectedTextOrDocumentText(editor),
        )

        if (
          flexQueryExecResult.exception ||
          flexQueryExecResult.exceptionStackTrace
        ) {
          console.log(flexQueryExecResult)

          openTxtWindow(
            JSON.stringify(flexQueryExecResult.exception, null, 2),
            `${new Date().toISOString()}.exception.json`,
          )
          openTxtWindow(
            flexQueryExecResult.exceptionStackTrace,
            `${new Date().toISOString()}.exceptionStackTrace.txt`,
          )

          return
        }

        await openCsvWindow(
          flexQueryExecResult.headers,
          flexQueryExecResult.resultList,
        )
      },
    ),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.flexibleSearchQuery.executeRawSQL',
      async () => {
        const editor = vscode.window.activeTextEditor
        if (editor === undefined) {
          return
        }

        const flexQueryExecResult = await hacUtils.executeFlexibleSearch(
          100000,
          undefined,
          getSelectedTextOrDocumentText(editor),
        )

        if (
          flexQueryExecResult.exception ||
          flexQueryExecResult.exceptionStackTrace
        ) {
          console.log(flexQueryExecResult)

          openTxtWindow(
            JSON.stringify(flexQueryExecResult.exception, null, 2),
            `${new Date().toISOString()}.exception.json`,
          )
          openTxtWindow(
            flexQueryExecResult.exceptionStackTrace,
            `${new Date().toISOString()}.exceptionStackTrace.txt`,
          )

          return
        }

        await openCsvWindow(
          flexQueryExecResult.headers,
          flexQueryExecResult.resultList,
        )
      },
    ),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.groovy.execute',
      async () => {
        const editor = vscode.window.activeTextEditor
        if (editor === undefined) {
          return
        }

        const groovyScriptExecResult = await hacUtils.executeGroovy(
          false,
          getSelectedTextOrDocumentText(editor),
        )

        openTxtWindow(
          groovyScriptExecResult.outputText,
          `${new Date().toISOString()}.output.txt`,
        )
        openTxtWindow(
          groovyScriptExecResult.executionResult,
          `${new Date().toISOString()}.executionResult.txt`,
        )
        if (groovyScriptExecResult.stacktraceText !== '') {
          openTxtWindow(
            groovyScriptExecResult.stacktraceText,
            `${new Date().toISOString()}.stacktraceText.txt`,
          )
        }
      },
    ),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.groovy.executeAndCommit',
      async () => {
        const editor = vscode.window.activeTextEditor
        if (editor === undefined) {
          return
        }

        const groovyScriptExecResult = await hacUtils.executeGroovy(
          true,
          getSelectedTextOrDocumentText(editor),
        )

        openTxtWindow(
          groovyScriptExecResult.outputText,
          `${new Date().toISOString()}.output.txt`,
        )
        openTxtWindow(
          groovyScriptExecResult.executionResult,
          `${new Date().toISOString()}.executionResult.txt`,
        )
        if (groovyScriptExecResult.stacktraceText !== '') {
          openTxtWindow(
            groovyScriptExecResult.stacktraceText,
            `${new Date().toISOString()}.stacktraceText.txt`,
          )
        }
      },
    ),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.clearCache',
      async () => {
        await hacUtils.clearCache()
      },
    ),
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getSelectedTextOrDocumentText(editor: vscode.TextEditor) {
  let selection = editor.selection
  if (selection.isEmpty) {
    return editor.document.getText()
  }

  return editor.document.getText(selection)
}

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

async function openCsvWindow(
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

async function openTxtWindow(txt: string, fileName?: string) {
  const uri = vscode.Uri.parse(
    `memfs:/${fileName ? fileName : new Date().toISOString() + '.txt'}`,
  )

  await vscode.workspace.fs.writeFile(uri, Buffer.from(txt))
  const document = await vscode.workspace.openTextDocument(uri)

  await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside)
}
