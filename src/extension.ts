// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { Grammar } from 'nearley'
import { FsqlCompletionItemProvider } from './fsql/fsql-completion-item-provider'
import { HacUtils } from './hac-utils'
import { FsqlDiagnosticProvider } from './fsql/fsql-diagnostic-provider'

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

function getSelectedTextOrDocumentText(editor: vscode.TextEditor) {
  let selection = editor.selection
  if (selection.isEmpty) {
    return editor.document.getText()
  }

  return editor.document.getText(selection)
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "my-vscode-hybris-tools" is now active!')

  const hacUtils = new HacUtils()

  /**
   * Provide Diagnostics
   */
  const fsqlDiagnosticProvider = new FsqlDiagnosticProvider(grammar)
  diagnosticCollection = vscode.languages.createDiagnosticCollection('flexibleSearchQuery')
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      diagnosticCollection.set(event.document.uri, [])
      diagnosticCollection.set(event.document.uri, fsqlDiagnosticProvider.getDiagnostics(event.document))
    }),
  )
  context.subscriptions.push(diagnosticCollection)

  /**
   * Show Code Completion Proposals
   */
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      'flexibleSearchQuery',
      new FsqlCompletionItemProvider(Grammar.fromCompiled(grammar), hacUtils),
    ),
  )

  /**
   * Commands
   */
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-hybris-tools.flexibleSearchQuery.execute', async () => {
      const editor = vscode.window.activeTextEditor
      if (editor === undefined) {
        return
      }

      const flexQueryExecResult = await hacUtils.executeFlexibleSearch(10, getSelectedTextOrDocumentText(editor))
      console.log(flexQueryExecResult.resultList.map(rl => rl[0]))
    }),
    vscode.commands.registerCommand('vscode-hybris-tools.flexibleSearchQuery.executeRawSQL', async () => {
      const editor = vscode.window.activeTextEditor
      if (editor === undefined) {
        return
      }

      const flexQueryExecResult = await hacUtils.executeFlexibleSearch(10, undefined, getSelectedTextOrDocumentText(editor))
      console.log(flexQueryExecResult)
    }),
    vscode.commands.registerCommand('vscode-hybris-tools.groovy.execute', async () => {
      const editor = vscode.window.activeTextEditor
      if (editor === undefined) {
        return
      }

      const groovyScriptExecResult = await hacUtils.executeGroovy(false, getSelectedTextOrDocumentText(editor))
      console.log(groovyScriptExecResult)
    }),
    vscode.commands.registerCommand('vscode-hybris-tools.groovy.executeAndCommit', async () => {
      const editor = vscode.window.activeTextEditor
      if (editor === undefined) {
        return
      }

      const groovyScriptExecResult = await hacUtils.executeGroovy(true, getSelectedTextOrDocumentText(editor))
      console.log(groovyScriptExecResult)
    }),
    vscode.commands.registerCommand('vscode-hybris-tools.clearCache', async () => {
      await hacUtils.clearCache()
    }),
  )
}

// this method is called when your extension is deactivated
export function deactivate() { }
