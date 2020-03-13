import * as vscode from 'vscode'
import { HacUtils } from '../hac-utils'
import { File, Directory } from './memfs'

export class GroovyFS implements vscode.FileSystemProvider {
  public onDidChangeFile: vscode.Event<
    vscode.FileChangeEvent[]
  > = new vscode.EventEmitter<vscode.FileChangeEvent[]>().event

  constructor(private hacUtils: HacUtils) {}

  watch(
    uri: vscode.Uri,
    options: { recursive: boolean; excludes: string[] },
  ): vscode.Disposable {
    return new vscode.Disposable(() => {})
  }

  async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
    console.log(`[stat] - ${uri}`)

    const res = await this._stat(uri)
    if (res.exists === false) {
      throw vscode.FileSystemError.FileNotFound()
    }

    if (res.type === '1') {
      const file = new File(res.name)

      file.type = vscode.FileType.File
      file.ctime = res.ctime
      file.mtime = res.mtime
      file.size = res.size

      return file
    } else if (res.type === '2') {
      const directory = new Directory(res.name)

      directory.type = vscode.FileType.Directory
      directory.ctime = res.ctime
      directory.mtime = res.mtime
      directory.size = res.size

      return directory
    }

    throw vscode.FileSystemError.FileNotFound()
  }

  async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
    console.log(`[readDirectory] - ${uri}`)

    let res = await this._readDirectory(uri)

    let paths: [string, vscode.FileType][] = []
    paths.push(
      ...res.files.map(
        f =>
          [f.replace(uri.path, ''), vscode.FileType.File] as [
            string,
            vscode.FileType,
          ],
      ),
    )
    paths.push(
      ...res.directories
        .filter(p => p !== uri.path)
        .map(
          f =>
            [f.replace(uri.path, ''), vscode.FileType.Directory] as [
              string,
              vscode.FileType,
            ],
        ),
    )

    return paths
  }

  createDirectory(uri: vscode.Uri): void | Thenable<void> {
    throw new Error('Method not implemented.')
  }

  async readFile(uri: vscode.Uri): Promise<Uint8Array> {
    console.log(`[readFile] - ${uri}`)

    let res = await this._readFile(uri)
    if (res.exists === false) {
      throw vscode.FileSystemError.FileNotFound()
    }

    let buffer: Buffer = new Buffer(res.base64, 'base64')
    return buffer
  }

  writeFile(
    uri: vscode.Uri,
    content: Uint8Array,
    options: { create: boolean; overwrite: boolean },
  ): void | Thenable<void> {
    throw new Error('Method not implemented.')
  }

  delete(
    uri: vscode.Uri,
    options: { recursive: boolean },
  ): void | Thenable<void> {
    throw new Error('Method not implemented.')
  }

  rename(
    oldUri: vscode.Uri,
    newUri: vscode.Uri,
    options: { overwrite: boolean },
  ): void | Thenable<void> {
    throw new Error('Method not implemented.')
  }

  private async _readDirectory(
    uri: vscode.Uri,
  ): Promise<{ directories: string[]; files: string[] }> {
    const script = `
      import com.google.gson.Gson

      import java.nio.file.Files
      import java.nio.file.Path
      import java.nio.file.Paths
      import java.util.stream.Collectors
      import java.util.stream.Stream

      Stream<Path> walk = Files.walk(Paths.get("$_FS_PATH"), 1)

      class Response {
          List<String> directories
          List<String> files
      }

      try {
          def paths = walk.collect(Collectors.toList())

          List<String> directories = paths
                  .stream()
                  .filter { p -> Files.isDirectory(p) }
                  .map { x -> x.toString() }
                  .collect(Collectors.toList())

          List<String> files = paths
                  .stream()
                  .filter { p -> Files.isRegularFile(p) }
                  .map { x -> x.toString() }
                  .collect(Collectors.toList())

          def response = new Response()
          response.directories = directories
          response.files = files

          new Gson().toJson(response)
      } catch (IOException e) {
          e.printStackTrace();
      } finally {
          walk.close()
      }
    `

    const execResult = await this.hacUtils.executeGroovy(
      false,
      script.replace('$_FS_PATH', uri.path),
    )
    const res = JSON.parse(execResult.executionResult) as {
      directories: string[]
      files: string[]
    }

    return res
  }

  private async _readFile(
    uri: vscode.Uri,
  ): Promise<{ exists: boolean; base64: string }> {
    const script = `
      import com.google.gson.Gson
      import org.apache.commons.codec.binary.Base64
      import org.apache.commons.io.FileUtils
      
      import java.nio.charset.StandardCharsets
      import java.nio.file.Files
      import java.nio.file.Paths
      
      class Response {
          String base64
          boolean exists
      }
      
      def path = Paths.get("$_FS_PATH")
      if (Files.notExists(path)) {
          def response = new Response()
          response.exists = false
      
          return new Gson().toJson(response)
      }
      
      def base64 = Base64.encodeBase64(Files.readAllBytes(path))
      
      def response = new Response()
      response.base64 = new String(base64, StandardCharsets.US_ASCII)
      response.exists = true
      
      new Gson().toJson(response)
    `

    const execResult = await this.hacUtils.executeGroovy(
      false,
      script.replace('$_FS_PATH', uri.path),
    )
    const res = JSON.parse(execResult.executionResult) as {
      exists: boolean
      base64: string
    }

    return res
  }

  private async _stat(uri: vscode.Uri) {
    const script = `
      import com.google.gson.Gson

      import java.nio.file.Files
      import java.nio.file.Paths
      import java.nio.file.attribute.BasicFileAttributes
      
      class Response {
          String name
          String type
          long ctime
          long mtime
          long size
          boolean exists
      }
      
      def path = Paths.get("$_FS_PATH")
      if (Files.notExists(path)) {
          def response = new Response()
          response.exists = false
      
          return new Gson().toJson(response)
      }
      
      int type = 0
      if (Files.isRegularFile(path)) {
          type = 1
      } else if (Files.isDirectory(path)) {
          type = 2
      }
      
      BasicFileAttributes attributes = Files.readAttributes(path, BasicFileAttributes.class)
      
      def response = new Response()
      response.name = path.getFileName()
      response.type = type.toString()
      response.ctime = attributes.creationTime().toMillis()
      response.mtime = attributes.lastModifiedTime().toMillis()
      response.size = attributes.size()
      response.exists = true
      
      new Gson().toJson(response)
    `

    const execResult = await this.hacUtils.executeGroovy(
      false,
      script.replace('$_FS_PATH', uri.path),
    )
    const res = JSON.parse(execResult.executionResult) as {
      type: '1' | '2'
      name: string
      ctime: number
      mtime: number
      size: number
      exists: boolean
    }

    return res
  }
}
