import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import type { Plugin, ResolvedConfig } from 'vite'

const toPascalCase = (str: string): string => {
  return str.replace(/(^\w|-\w)/g, clearAndUpper)
}

const clearAndUpper = (text: string): string => {
  return text.replace(/-/, '').toUpperCase()
}

// 递归获取目录下所有的 .vue 文件
const getAllVueFiles = (dir: string, fileList: string[] = []): string[] => {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      getAllVueFiles(filePath, fileList)
    } else if (filePath.endsWith('.vue')) {
      fileList.push(filePath)
    }
  })
  return fileList
}

// 从 .vue 文件内容中提取组件名称
const extractComponentName = (fileContent: string): string | null => {
  const regex = /defineOptions\(\s*{\s*name:\s*["']([^"']+)["']/
  const match = fileContent.match(regex)
  return match ? match[1] : null
}

// Vite 插件定义
const vueFilePathPlugin = (outputFilePath: string): Plugin => {
  let root: string

  const generatePathNameMap = () => {
    const vueFiles = [...getAllVueFiles(path.join(root, 'src/views'))]
    const pathNameMap = vueFiles.reduce(
      (acc: Record<string, string>, filePath: string) => {
        const content = fs.readFileSync(filePath, 'utf-8')
        const componentName = extractComponentName(content)
        let relativePath =
          '/' + path.relative(root, filePath).replace(/\\/g, '/')
        acc[relativePath] =
          componentName || toPascalCase(path.basename(filePath, '.vue'))
        return acc
      },
      {}
    )
    const outputContent = JSON.stringify(pathNameMap, null, 2)
    fs.writeFileSync(outputFilePath, outputContent)
  }

  const watchDirectoryChanges = () => {
    const watchDirectories = [path.join(root, 'src/views')]
    const watcher = chokidar.watch(watchDirectories, {
      persistent: true,
      ignoreInitial: true
    })
    watcher.on('all', () => {
      generatePathNameMap()
    })
  }

  return {
    name: 'vue-file-path-plugin',
    configResolved(resolvedConfig: ResolvedConfig) {
      root = resolvedConfig.root
    },
    buildStart() {
      generatePathNameMap()
    },
    buildEnd() {
      if (process.env.NODE_ENV === 'development') {
        watchDirectoryChanges()
      }
    }
  }
}

export default vueFilePathPlugin
