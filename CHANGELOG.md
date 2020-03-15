# Change Log

All notable changes to the "my-vscode-hybris-tools" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## 1.1.0

- General - Init GroovyFS (Virtual File System)
- General - Fixed the focus point after executions of Groovy, Fsql
- General - Added the active HAC url and the active username as an status bar item
- General - Added a confirmation box before the first execution of Groovy, Fsql

## 1.0.10

- Sql  - Support formatting
- Fsql - Enhanced fsql to sql translations

## 1.0.9

- Fixed some bugs

## 1.0.8

- Added `.fxs`
- Fixed the fsql format, column_ref and type

## 1.0.7

- Fixed `Hybris: Execute Raw SQL` wrongly binded to `Hybris: Execute FSQL`

## 1.0.6

- Grammar - Allow operand in function

## 1.0.5

- Fixed 403 errors when multiple requests are created in HacUtils
- Migrated from memfs to localfs
- Fixed formats of a subquery

## 1.0.4

- More autocompletion features

## 1.0.3

- Fixed `REGEXP` in fsql

## 1.0.2

- Enhanced the attribute autocompletion when no typeAlias e.g. typing typeAlias
- Bumped packages

## 1.0.1
## 1.0.0

- Published to VSCode Marketplace
- Enhanced README

## 0.0.9

- Enhanced the fsql grammar (Interval, IN / NOT IN, Single-expression condition)
- Fixed the naming of some vscode settings
- Added more completion keywords

## 0.0.8

- Add a fsql to raw sql command `Hybris: Translate to Raw SQL`
- Add a databaseColumn in the definition provider for types
- Support comments in fsql
- Add some snippets for autocompletion i.e. `WHERE`, `JOIN`, `ON`, `AS`, `AND`, `OR`
- Add subquery autocompletion
- Add a loading badge for attribute autocompletion
- Support impEx (Execution, Validation)
- Add a better formatter

## 0.0.6

- Add messages when execution errors

## 0.0.5

- Add a unified caches for all modules and Support clearing
- Add a fsql formatter
- Add a definition provider for types
- Add a configuration `vscode-hybris-tools.offline.typeCodes` to provide types autocompletition, when Hybris is not connectable.
  Use a new command `Hybris: Display Caches` to see the indexed types, and put `fsqlComposedTypeCodes` into `vscode-hybris-tools.offline.typeCodes`.

## 0.0.4

- Add autocompletion for attributes

## 0.0.3

- Add keybindings for executing groovy and fsql
- Add csv and txt to display results of groovy and fsql