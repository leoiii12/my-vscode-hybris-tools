# my-vscode-hybris-tools README

### Getting Started 

https://docs.google.com/presentation/d/1dWoE6_gfGKV0wwEU5XDJmwHHoOJiO5BATnyd7NPPLkU/edit#slide=id.p

![](images/autocomplete.gif)<br><br>
![](images/attributes.gif)<br><br>
![](images/execute-fsql.gif)<br><br>
![](images/translate-fsql-to-sql.gif)

## Features

### General

1. Execute fsql (`F5`)
2. Convert fsql to sql and fill in parameters
3. Execute groovy (`F5`)
4. Execute and Commit groovy (`Shift + F5`)
5. Import ImpEx (`F5`)

### Fsql

1. Validate fsql syntax
2. Autocompletion for hybris types, hybris type attributes
3. fsql Formatter
4. See the definition of a hybris type, an alias
5. Auto fix actions for `1` as conditions instead of `1 = 1`

### Beta

1. GroovyFS

## Requirements

Please provide a connectable hybris before using the extension.

## Extension Settings

* `vscode-hybris-tools.hac.url`: The URL to the hybris HAC extension.
* `vscode-hybris-tools.hac.username`: The username used for logging in the HAC.
* `vscode-hybris-tools.hac.password`: The password used for logging in the HAC.
* `vscode-hybris-tools.http.timeout`: The HTTP socket timeout.
* `vscode-hybris-tools.http.useStrictSSL`: Use strict SSL.
* `vscode-hybris-tools.offline.typeCodes`: The type codes for offline types autocompletion. e.g. ["OfflineType", "HelloWorld"]

The following is the default settings.

```json
{
  "vscode-hybris-tools.hac.url": "https://localhost:9012/hac",
  "vscode-hybris-tools.hac.username": "admin",
  "vscode-hybris-tools.hac.password": "nimda",
  "vscode-hybris-tools.http.timeout": 10000,
  "vscode-hybris-tools.http.useStrictSSL": false,
  "vscode-hybris-tools.offline.typeCodes": [
    "OfflineCode",
    "HelloWorld"
  ],

  // To have autocompletion in snippets, you need to have this false.
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  "editor.suggestSelection": "first"
}
```

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Please see `./CHANGELOG.md`.

## The Future

Please see `./ROADMAP.md`.

### For more information

* [Our parser and some sample features](https://github.com/leoiii12/flex-query-parser)
* [vscode-hybris-tools](https://github.com/vscode-hybris-tools/vscode-hybris-tools)
* [FSQL syntax](https://help.sap.com/doc/a4265d5ea8314eb2929e6cf6fb8e35a5/1811/en-US/de/hybris/platform/servicelayer/search/FlexibleSearchService.html)

**Enjoy!**
