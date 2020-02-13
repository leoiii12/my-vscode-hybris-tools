// import * as vscode from 'vscode'

export namespace Config {
  export function getHacUrl(): string {
    // if (vscode)
    //   return vscode.workspace.getConfiguration().get('vscode-hybris-tools.hac.url') || 'https://localhost:9012/hac/'

    return 'https://localhost:9012/hac'
  }

  export function getHacUsername(): string {
    // if (vscode)
    //   return vscode.workspace.getConfiguration().get('vscode-hybris-tools.hac.username') || 'admin'

    return 'admin'
  }

  export function getHacPassword(): string {
    // if (vscode)
    //   return vscode.workspace.getConfiguration().get('vscode-hybris-tools.hac.password') || 'philipsspilihp'

    return 'philipsspilihp'
  }

  export function getHttpTimeout(): number {
    // if (vscode)
    //   return vscode.workspace.getConfiguration().get('vscode-hybris-tools.http.timeout') || 60 * 1000

    return 60 * 1000
  }

  export function getHttpUseStrictSSL(): boolean {
    // if (vscode)
    //   return vscode.workspace.getConfiguration().get('vscode-hybris-tools.http.useStrictSSL') || false

    return false
  }
}
