import { Grammar } from 'nearley'
import * as vscode from 'vscode'

import { FsqlCommands } from './fsql/fsql-commands'
import { FsqlCompletionAttributeItemProvider } from './fsql/fsql-completion-attribute-item-provider'
import { FsqlCompletionItemProvider } from './fsql/fsql-completion-item-provider'
import { FsqlDiagnosticProvider } from './fsql/fsql-diagnostic-provider'
import { GroovyCommands } from './groovy/groovy-commands'
import { HacUtils } from './hac-utils'
import { InternalCaches } from './internal-caches'
import { MemFS } from './memfs'

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
  const internalCaches = new InternalCaches()

  initCachesWithProgress(hacUtils)

  /**
   * MemFS - File System Provider
   */
  const memFs = new MemFS()
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider('memfs', memFs, {
      isCaseSensitive: true,
    }),
  )

  /**
   * Fsql - Provide Diagnostics
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
   * Fsql - Show Code Completion Proposals
   */
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      'flexibleSearchQuery',
      new FsqlCompletionItemProvider(
        Grammar.fromCompiled(grammar),
        internalCaches,
      ),
    ),
  )
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      'flexibleSearchQuery',
      new FsqlCompletionAttributeItemProvider(
        Grammar.fromCompiled(grammar),
        new HacUtils(),
        internalCaches,
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
        FsqlCommands.execute(hacUtils)
      },
    ),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.flexibleSearchQuery.executeRawSQL',
      async () => {
        FsqlCommands.executeRawSql(hacUtils)
      },
    ),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.groovy.execute',
      async () => {
        GroovyCommands.execute(hacUtils)
      },
    ),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.groovy.executeAndCommit',
      async () => {
        GroovyCommands.executeAndCommit(hacUtils)
      },
    ),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.hybris.clearCache',
      async () => {
        await hacUtils.clearCache()
      },
    ),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.clearCache',
      async () => {
        initCachesWithProgress(hacUtils)
      },
    ),
  )

  // *********************
  //
  // Internal Functions
  //
  // *********************

  function initCachesWithProgress(hacUtils: HacUtils) {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Started retrieve types from Hybris.',
        cancellable: false,
      },
      progress => {
        progress.report({
          increment: 20,
          message: 'Retrieving types from Hybris...',
        })

        return internalCaches.init(hacUtils).catch(() => {
          vscode.window.showErrorMessage(
            "Can't retrieve types from Hybris. Please make sure hybris is running.",
          )
        })
      },
    )
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
