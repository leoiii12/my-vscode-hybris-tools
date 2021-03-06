import { Grammar } from 'nearley'
import * as vscode from 'vscode'

import { Config } from './config'
import { GroovyFS } from './fs/groovyfs'
import { MemFS } from './fs/memfs'
import { Hac, MultiHac } from './hac'
import { InternalCaches } from './internal-caches'
import { FsqlCodeActionProvider } from './lang-fsql/fsql-code-action-provider'
import { FsqlCommands } from './lang-fsql/fsql-commands'
import { FsqlCompletionAttributeItemProvider } from './lang-fsql/fsql-completion-attribute-item-provider'
import { FsqlCompletionItemProvider } from './lang-fsql/fsql-completion-item-provider'
import { FsqlDefinitionProvider } from './lang-fsql/fsql-definition-provider'
import { FsqlDiagnosticProvider } from './lang-fsql/fsql-diagnostic-provider'
import { FsqlDocumentFormattingEditProvider } from './lang-fsql/fsql-document-formatting-edit-provider'
import { GroovyCommands } from './lang-groovy/groovy-commands'
import { ImpExCommands } from './lang-imp-ex/imp-ex-commands'
import { SqlDocumentFormattingEditProvider } from './lang-sql/sql-document-formatting-edit-provider'
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

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
  )
  statusBarItem.text = `${Config.getHacUrl()} (${Config.getHacUsername()})`
  statusBarItem.show()

  const internalCaches = new InternalCaches()
  const usrHac = new MultiHac(1, internalCaches)
  const sysHac = new MultiHac(2)

  initCachesWithProgress(sysHac)

  // *********************
  //
  // MemFS
  //
  // *********************
  const memFs = new MemFS()
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider('memfs', memFs, {
      isCaseSensitive: true,
    }),
  )

  // *********************
  //
  // GroovyFS
  //
  // *********************
  const groovyFs = new GroovyFS(sysHac)
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider('groovyfs', groovyFs, {
      isCaseSensitive: true,
    }),
  )
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'vscode-hybris-tools.groovyfs.init',
      async _ => {
        const options: vscode.InputBoxOptions = {
          prompt: 'Path',
          value: '/',
        }

        const inputBoxValue = await vscode.window.showInputBox(options)
        if (inputBoxValue === undefined) {
          return
        }

        const normalizedInputBoxValue =
          inputBoxValue.endsWith('/') && inputBoxValue.length > 1
            ? inputBoxValue.replace(/\/$/, '')
            : inputBoxValue

        vscode.workspace.updateWorkspaceFolders(
          vscode.workspace.workspaceFolders === undefined
            ? 0
            : vscode.workspace.workspaceFolders.length,
          0,
          {
            uri: vscode.Uri.parse(`groovyfs:${normalizedInputBoxValue}`),
            name: `GroovyFS - ${normalizedInputBoxValue}`,
          },
        )
      },
    ),
  )

  // *********************
  //
  // Features
  //
  // *********************

  registerSqlFeatures()
  registerFsqlFeatures()

  /**
   * Commands
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'vscode-hybris-tools.flexibleSearchQuery.execute',
      () =>
        VscodeUtils.withProgress(
          FsqlCommands.execute(usrHac).catch(err => {
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
          FsqlCommands.executeRawSql(usrHac).catch(err => {
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
          FsqlCommands.translateFsqlToRawSql(usrHac).catch(err => {
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
        GroovyCommands.execute(usrHac).catch(err => {
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
          GroovyCommands.executeAndCommit(usrHac).catch(err => {
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
        ImpExCommands.importImpEx(usrHac).catch((err: Error) => {
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
        ImpExCommands.validateImpEx(usrHac).catch((err: Error) => {
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
          usrHac.clearCaches().catch(err => {
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
        initCachesWithProgress(usrHac)
      },
    ),
  )

  // *********************
  //
  // Modules
  //
  // *********************

  function registerSqlFeatures() {
    context.subscriptions.push(
      vscode.languages.registerDocumentFormattingEditProvider(
        {
          language: 'sql',
        },
        new SqlDocumentFormattingEditProvider(),
      ),
    )
  }

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
        ...'abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      ),
    )
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        {
          language: 'flexibleSearchQuery',
        },
        new FsqlCompletionAttributeItemProvider(
          Grammar.fromCompiled(fsqlGrammar),
          sysHac,
          internalCaches,
          fsqlMooRules.rules,
        ),
        ...'.:[]abcdefghijklmnopqrstuvwsyz',
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
          sysHac,
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

  function initCachesWithProgress(hac: Hac) {
    const promise = internalCaches.init(hac).catch(() => {
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
