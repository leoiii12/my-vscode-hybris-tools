import { Grammar } from 'nearley'
import * as vscode from 'vscode'

import { Config } from './config'
import { FsqlCodeActionProvider } from './fsql/fsql-code-action-provider'
import { FsqlCommands } from './fsql/fsql-commands'
import { FsqlCompletionAttributeItemProvider } from './fsql/fsql-completion-attribute-item-provider'
import { FsqlCompletionItemProvider } from './fsql/fsql-completion-item-provider'
import { FsqlDefinitionProvider } from './fsql/fsql-definition-provider'
import { FsqlDiagnosticProvider } from './fsql/fsql-diagnostic-provider'
import { FsqlDocumentFormattingEditProvider } from './fsql/fsql-document-formatting-edit-provider'
import { GroovyCommands } from './groovy/groovy-commands'
import { HacUtils } from './hac-utils'
import { ImpExCommands } from './imp-ex/imp-ex-commands'
import { InternalCaches } from './internal-caches'
import { MemFS } from './memfs'
import { VscodeUtils } from './vscode-utils'

const fsqlGrammar = require('../syntaxes/flexibleSearchQuery.js')
const fsqlMooRules = require('../syntaxes/flexibleSearchQuery.moo-rules.js')

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

  registerFsqlFeatures()

  /**
   * Commands
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'vscode-hybris-tools.flexibleSearchQuery.execute',
      () =>
        VscodeUtils.withProgress(
          FsqlCommands.execute(hacUtils).catch(err => {
            vscode.window.showErrorMessage(
              err ? err.message : 'Timeout. Please check whether Hybris is on.',
            )
            return false
          }),
          'Executing, Please wait...',
        ),
    ),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.flexibleSearchQuery.executeRawSQL',
      () =>
        VscodeUtils.withProgress(
          FsqlCommands.execute(hacUtils).catch(err => {
            vscode.window.showErrorMessage(
              err ? err.message : 'Timeout. Please check whether Hybris is on.',
            )
            return false
          }),
          'Executing, Please wait...',
        ),
    ),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.flexibleSearchQuery.translateToRawSQL',
      () =>
        VscodeUtils.withProgress(
          FsqlCommands.translateFsqlToRawSql(hacUtils).catch(err => {
            vscode.window.showErrorMessage(
              err ? err.message : 'Timeout. Please check whether Hybris is on.',
            )
            return false
          }),
          'Executing, Please wait...',
        ),
    ),
    vscode.commands.registerCommand('vscode-hybris-tools.groovy.execute', () =>
      VscodeUtils.withProgress(
        GroovyCommands.execute(hacUtils).catch(err => {
          vscode.window.showErrorMessage(
            err ? err.message : 'Timeout. Please check whether Hybris is on.',
          )
          return false
        }),
        'Executing, Please wait...',
      ),
    ),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.groovy.executeAndCommit',
      () =>
        VscodeUtils.withProgress(
          GroovyCommands.executeAndCommit(hacUtils).catch(err => {
            vscode.window.showErrorMessage(
              err ? err.message : 'Timeout. Please check whether Hybris is on.',
            )

            return false
          }),
          'Executing And Committing, Please wait...',
        ),
    ),
    vscode.commands.registerCommand('vscode-hybris-tools.impEx.import', () =>
      VscodeUtils.withProgress(
        ImpExCommands.importImpEx(hacUtils).catch((err: Error) => {
          vscode.window.showErrorMessage(
            err ? err.message : 'Timeout. Please check whether Hybris is on.',
          )
          return false
        }),
        'Importing, Please wait...',
      ),
    ),
    vscode.commands.registerCommand('vscode-hybris-tools.impEx.validate', () =>
      VscodeUtils.withProgress(
        ImpExCommands.validateImpEx(hacUtils).catch((err: Error) => {
          vscode.window.showErrorMessage(
            err ? err.message : 'Timeout. Please check whether Hybris is on.',
          )
          return false
        }),
        'Validating, Please wait...',
      ),
    ),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.hybris.clearCaches',
      () =>
        VscodeUtils.withProgress(
          hacUtils.clearCaches().catch(err => {
            vscode.window.showErrorMessage(
              err ? err.message : 'Timeout. Please check whether Hybris is on.',
            )
            return false
          }),
          'Clearing, Please wait...',
        ),
    ),
    vscode.commands.registerCommand('vscode-hybris-tools.displayCaches', () => {
      VscodeUtils.openTxtWindow(
        JSON.stringify(internalCaches, undefined, 2),
        'caches.json',
      )
    }),
    vscode.commands.registerCommand(
      'vscode-hybris-tools.clearCaches',
      async () => {
        initCachesWithProgress(hacUtils)
      },
    ),
  )

  // *********************
  //
  // Modules
  //
  // *********************

  function registerFsqlFeatures() {
    let fsqlDiagnosticCollection: vscode.DiagnosticCollection

    /**
     * DiagnosticsProvider
     */
    const fsqlDiagnosticProvider = new FsqlDiagnosticProvider(fsqlGrammar)
    fsqlDiagnosticCollection = vscode.languages.createDiagnosticCollection(
      'flexibleSearchQuery',
    )
    context.subscriptions.push(
      vscode.workspace.onDidOpenTextDocument(document => {
        if (document.languageId !== 'flexibleSearchQuery') {
          return
        }

        fsqlDiagnosticCollection.set(document.uri, [])
        fsqlDiagnosticCollection.set(
          document.uri,
          fsqlDiagnosticProvider.getDiagnostics(document),
        )
      }),
      vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId !== 'flexibleSearchQuery') {
          return
        }

        fsqlDiagnosticCollection.set(event.document.uri, [])
        fsqlDiagnosticCollection.set(
          event.document.uri,
          fsqlDiagnosticProvider.getDiagnostics(event.document),
        )
      }),
    )
    context.subscriptions.push(fsqlDiagnosticCollection)

    /**
     * CompletionItemProvider
     */
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        {
          language: 'flexibleSearchQuery',
        },
        new FsqlCompletionItemProvider(
          Grammar.fromCompiled(fsqlGrammar),
          internalCaches,
          fsqlMooRules.rules,
        ),
      ),
    )
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        {
          language: 'flexibleSearchQuery',
        },
        new FsqlCompletionAttributeItemProvider(
          Grammar.fromCompiled(fsqlGrammar),
          new HacUtils(),
          internalCaches,
          fsqlMooRules.rules,
        ),
        ...['.', ':', '[', ']'],
      ),
    )
    context.subscriptions.push(
      vscode.languages.registerDocumentFormattingEditProvider(
        {
          language: 'flexibleSearchQuery',
        },
        new FsqlDocumentFormattingEditProvider(fsqlGrammar),
      ),
    )
    context.subscriptions.push(
      vscode.languages.registerDefinitionProvider(
        {
          language: 'flexibleSearchQuery',
        },
        new FsqlDefinitionProvider(
          fsqlGrammar,
          internalCaches,
          hacUtils,
          fsqlMooRules.rules,
        ),
      ),
    )
    context.subscriptions.push(
      vscode.languages.registerCodeActionsProvider(
        {
          language: 'flexibleSearchQuery',
        },
        new FsqlCodeActionProvider(fsqlGrammar, fsqlMooRules.rules),
      ),
    )
  }

  // *********************
  //
  // Internal
  //
  // *********************

  function initCachesWithProgress(hacUtils: HacUtils) {
    const promise = internalCaches.init(hacUtils).catch(() => {
      vscode.window.showErrorMessage(
        "Can't retrieve types from Hybris. Please make sure it is running. \n" +
          'vscode-hybris-tools.offline.typeCodes is in use.',
      )

      internalCaches.fsqlComposedTypeCodes = Config.getOfflineTypeCodes()

      return false
    })

    VscodeUtils.withProgress(
      promise,
      'Retrieving types from Hybris, Please wait...',
    )
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
