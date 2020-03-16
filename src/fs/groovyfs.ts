import { inflate } from 'pako'
import * as vscode from 'vscode'

import { Hac } from '../hac'
import { Directory, File } from './memfs'

const MAX_NUM_LINES_IN_FILE = 100000

export class GroovyFS implements vscode.FileSystemProvider {
  public onDidChangeFile: vscode.Event<
    vscode.FileChangeEvent[]
  > = new vscode.EventEmitter<vscode.FileChangeEvent[]>().event

  constructor(private hac: Hac) {}

  watch(
    uri: vscode.Uri,
    options: { recursive: boolean; excludes: string[] },
  ): vscode.Disposable {
    return new vscode.Disposable(() => {})
  }

  async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
    console.log(`[stat] - ${uri}`)

    const isPartial = uri.path.includes('.mvht-partial')
    const parts = uri.toString().split('.mvht-partial')

    const res = await this._stat(vscode.Uri.parse(parts[0]))
    if (res.exists === false) {
      throw vscode.FileSystemError.FileNotFound()
    }

    if (res.type === '2' || (isPartial && parts[1].length === 0)) {
      const directory = new Directory(res.name)

      directory.type = vscode.FileType.Directory
      directory.ctime = res.ctime
      directory.mtime = res.mtime
      directory.size = res.size

      return directory
    } else if (res.type === '1') {
      const file = new File(res.name)

      file.type = vscode.FileType.File
      file.ctime = res.ctime
      file.mtime = res.mtime
      file.size = res.size

      return file
    }

    throw vscode.FileSystemError.FileNotFound()
  }

  async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
    console.log(`[readDirectory] - ${uri}`)

    if (uri.path.endsWith('.mvht-partial')) {
      const { exists, numOfLines } = await this._readTextFileLinesCount(
        vscode.Uri.parse(uri.toString().replace(/\.mvht\-partial$/, '')),
      )
      const paths = [] as [string, vscode.FileType][]

      const numOfPartialFiles = Math.ceil(numOfLines / MAX_NUM_LINES_IN_FILE)
      for (let i = 0; i < numOfPartialFiles; i++) {
        paths.push([`${i}`, vscode.FileType.File])
      }

      return paths
    }

    const res = await this._readDirectory(uri)

    const paths = [] as [string, vscode.FileType][]
    paths.push(
      ...res.files
        .filter(p => p[0] !== uri.path)
        .map(([path, isTextFile]) => {
          if (isTextFile === true) {
            return [
              `${path.replace(uri.path, '')}.mvht-partial`,
              vscode.FileType.Directory,
            ] as [string, vscode.FileType]
          }

          return [path.replace(uri.path, ''), vscode.FileType.File] as [
            string,
            vscode.FileType,
          ]
        }),
    )
    paths.push(
      ...res.directories
        .filter(p => p[0] !== uri.path)
        .map(
          ([path, _]) =>
            [path.replace(uri.path, ''), vscode.FileType.Directory] as [
              string,
              vscode.FileType,
            ],
        ),
    )

    return paths
  }

  async readFile(uri: vscode.Uri): Promise<Uint8Array> {
    console.log(`[readFile] - ${uri}`)

    if (uri.path.includes('.mvht-partial/') === true) {
      const parts = uri.toString().split('.mvht-partial/')
      const start = parseInt(parts[1]) * MAX_NUM_LINES_IN_FILE
      const end = start + MAX_NUM_LINES_IN_FILE

      let res = await this._readTextFileOfRange(
        vscode.Uri.parse(parts[0]),
        start,
        end,
      )
      if (res.exists === false) {
        throw vscode.FileSystemError.FileNotFound()
      }

      let buffer = Buffer.alloc(res.base64.length, 'base64')
      buffer.write(res.base64, 'base64')

      return inflate(buffer)
    }

    let res = await this._readFile(uri)
    if (res.exists === false) {
      throw vscode.FileSystemError.FileNotFound()
    }

    let buffer = Buffer.alloc(res.base64.length, 'base64')
    buffer.write(res.base64, 'base64')

    return buffer
  }

  createDirectory(uri: vscode.Uri): void | Thenable<void> {
    throw new Error('Method not implemented.')
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

  /**
   *
   * @param uri
   * @returns [path, isLongTextFile][]
   */
  private async _readDirectory(
    uri: vscode.Uri,
  ): Promise<{
    directories: [string, boolean][]
    files: [string, boolean][]
  }> {
    const script = `
      import com.google.gson.Gson

      import java.nio.file.Files
      import java.nio.file.Path
      import java.nio.file.Paths
      import java.util.stream.Collectors
      import java.util.stream.Stream

      Path path = Paths.get("$_FS_PATH")
      Stream<Path> walk = Files.walk(path, 1)

      class Response {
          List<List<Serializable>> directories
          List<List<Serializable>> files
      }

      try {
          def paths = walk.collect(Collectors.toList())

          List<List<Serializable>> directories = paths
                  .stream()
                  .filter { p -> Files.isDirectory(p) }
                  .map { x -> [x.toString(), false] }
                  .collect(Collectors.toList())

          List<List<Serializable>> files = paths
                  .stream()
                  .filter { p -> Files.isRegularFile(p) }
                  .map { p ->
                      if (Files.size(p) > 20 * 1024 * 1024 && Files.probeContentType(p).startsWith("text/")) {
                          return [p.toString(), true]
                      }

                      return [p.toString(), false]
                  }
                  .collect(Collectors.toList())

          def response = new Response()
          response.directories = directories
          response.files = files

          new Gson().toJson(response)
      } catch (IOException e) {
          e.printStackTrace()
      } finally {
          walk.close()
      }
    `

    const execResult = await this.hac.executeGroovy(
      false,
      script.replace('$_FS_PATH', uri.path),
    )
    const res = JSON.parse(execResult.executionResult) as {
      directories: [string, boolean][]
      files: [string, boolean][]
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
      
      def response = new Response()
      response.base64 = Base64.encodeBase64String(Files.readAllBytes(path))
      response.exists = true
      
      new Gson().toJson(response)
    `

    const execResult = await this.hac.executeGroovy(
      false,
      script.replace('$_FS_PATH', uri.path),
    )
    const res = JSON.parse(execResult.executionResult) as {
      exists: boolean
      base64: string
    }

    return res
  }

  private async _readTextFileLinesCount(uri: vscode.Uri) {
    const script = `
      import com.google.gson.Gson

      import java.nio.file.Files
      import java.nio.file.Paths
      import java.nio.file.Path
      import java.time.Duration
      import java.time.Instant

      class Response {
          long numOfLines
          boolean exists
      }

      def path = Paths.get("$_FS_PATH")
      if (Files.notExists(path)) {
          def response = new Response()
          response.exists = false

          return new Gson().toJson(response)
      }
      def linesStream = Files.lines(path)

      def response = new Response()
      response.numOfLines = linesStream.count()
      response.exists = true

      linesStream.close()

      return new Gson().toJson(response)
    `

    const execResult = await this.hac.executeGroovy(
      false,
      script.replace('$_FS_PATH', uri.path),
    )
    const res = JSON.parse(execResult.executionResult) as {
      exists: boolean
      numOfLines: number
    }

    return res
  }

  private async _readTextFileOfRange(
    uri: vscode.Uri,
    start: number,
    end: number,
  ) {
    const script = `
      import java.nio.charset.Charset
      import java.nio.file.Files
      import java.nio.file.Paths
      import java.util.function.Consumer
      import java.util.zip.GZIPOutputStream
      
      class Response {
          String base64
          boolean exists
      }
      
      def start = $_START
      def end = $_END
      
      def path = Paths.get("$_FS_PATH")
      if (Files.notExists(path)) {
          return "{\\"exists\\":false}"
      }
      
      def response = new Response()
      def linesStream = Files.lines(path)
      def base64Encoder = Base64.getEncoder()
      
      ByteArrayOutputStream out = new ByteArrayOutputStream();
      def gzipOut = new GZIPOutputStream(out)
      
      linesStream
              .skip(start)
              .limit(end - start)
              .forEach(new Consumer<String>() {
                  final def BYTE = '\\n'.getBytes(Charset.forName("UTF-8"))
      
                  @Override
                  void accept(String s) {
                      try {
                          gzipOut.write(s.getBytes(Charset.forName("UTF-8")))
                          gzipOut.write(BYTE)
                      } catch (IOException e1) {
                          throw new RuntimeException(e1)
                      }
                  }
              })
      
      linesStream.close()
      gzipOut.flush()
      gzipOut.close()
      
      response.base64 = base64Encoder.encodeToString(out.toByteArray())
      response.exists = true
      
      out.close()
      
      // To optimize the performance, we use the native StringBuilder
      def sb = new StringBuilder()
      sb.append("{")
      sb.append("\\"base64\\":\\"").append(response.base64).append("\\",")
      sb.append("\\"exists\\":").append(response.exists)
      sb.append("}")
      
      sb.toString()
    `

    const execResult = await this.hac.executeGroovy(
      false,
      script
        .replace('$_FS_PATH', uri.path)
        .replace('$_START', start.toString())
        .replace('$_END', end.toString()),
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

    const execResult = await this.hac.executeGroovy(
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
