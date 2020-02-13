// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { Grammar } from 'nearley'
import { FsqlCompletionItemProvider } from './fsql/fsql-completion-item-provider'
import { HacUtils } from './hac-utils'

const grammar = require('../syntaxes/flexibleSearchQuery.js')

export interface ParseRow {
  index: number
  states: any[]
  wants: any[]
  scannable: any[]
  completed: any
  lexerState: { line: number; col: number }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "my-vscode-hybris-tools" is now active!')

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World!')
  })

  context.subscriptions.push(disposable)

  const hacUtils = new HacUtils()

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      'flexibleSearchQuery',
      new FsqlCompletionItemProvider(Grammar.fromCompiled(grammar), hacUtils),
    ),
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
