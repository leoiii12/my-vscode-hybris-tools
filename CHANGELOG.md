# Change Log

All notable changes to the "my-vscode-hybris-tools" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## 0.0.7

- Add a fsql to raw sql command `Hybris: Translate to Raw SQL`
- Add a databaseColumn in the definition provider for types

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