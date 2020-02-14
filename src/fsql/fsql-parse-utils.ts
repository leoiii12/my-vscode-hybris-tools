export namespace FsqlParseUtils {
  export function getTokens(text: string): string[] {
    return text.split(/[ \t\n\v\f]/).filter(c => c !== '')
  }
}
