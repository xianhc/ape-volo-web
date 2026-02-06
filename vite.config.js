import { defineConfig, loadEnv } from 'vite'
import legacyPlugin from '@vitejs/plugin-legacy'
import bannerPlugin from 'vite-plugin-banner'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import vuePlugin from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueFilePathPlugin from './componentNameMap.js'
import { printWelcomeOnce } from './src/welcome.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const toNumber = (value, fallback) => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : fallback
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode || 'development', process.cwd(), '')

  // 把 .env.* 写入 process.env，便于插件/脚本复用
  for (const [key, value] of Object.entries(env)) {
    process.env[key] = value
  }

  const timestamp = Date.now()

  const alias = {
    '@': path.resolve(__dirname, 'src'),
    vue$: 'vue/dist/vue.runtime.esm-bundler.js'
  }

  const rollupOptions = {
    output: {
      entryFileNames: 'assets/A92E5D4B7C1F8E3A6B4C9D2F0E7A1B3C[name].[hash].js',
      chunkFileNames: 'assets/A92E5D4B7C1F8E3A6B4C9D2F0E7A1B3C[name].[hash].js',
      assetFileNames:
        'assets/A92E5D4B7C1F8E3A6B4C9D2F0E7A1B3C[name].[hash].[ext]'
    }
  }

  const baseApi = env.VITE_BASE_API || '/api'
  const cliPort = toNumber(env.VITE_CLI_PORT, 8001)
  const serverPort = env.VITE_SERVER_PORT
  const basePath = env.VITE_BASE_PATH
  const proxyTarget = serverPort ? `${basePath}:${serverPort}/` : `${basePath}/`

  const config = {
    base: '/', // 编译后js导入的资源路径
    root: './', // index.html文件所在位置
    publicDir: 'public', // 静态资源文件夹
    resolve: {
      alias
    },
    define: {
      'process.env': {}
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // or "modern"
        }
      },
      postcss: './postcss.config.js'
    },
    server: {
      open: true,
      port: cliPort,
      proxy: {
        // 把key的路径代理到target位置
        // detail: https://cli.vuejs.org/config/#devserver-proxy
        [baseApi]: {
          // 需要代理的路径   例如 '/api'
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (proxyPath) =>
            proxyPath.replace(new RegExp('^' + baseApi), '')
        }
      }
    },
    build: {
      minify: 'terser', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
      manifest: false, // 是否产出manifest.json
      sourcemap: false, // 是否产出sourcemap.json
      outDir: 'dist', // 产出目录
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions
    },
    plugins: [
      env.VITE_POSITION === 'open' &&
        vueDevTools({ launchEditor: env.VITE_EDITOR }),
      legacyPlugin({
        targets: [
          'Android > 39',
          'Chrome >= 60',
          'Safari >= 10.1',
          'iOS >= 10.3',
          'Firefox >= 54',
          'Edge >= 15'
        ]
      }),
      vuePlugin(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        //symbolId: 'icon-[dir]-[name]' // 支持子目录，避免重名
        symbolId: 'icon-[name]'
      }),
      bannerPlugin(`\n build based on ape-volo-admin \n Time : ${timestamp}`),
      vueFilePathPlugin('./src/plugins/pathInfo.json'),
      {
        name: 'ape-volo-welcome-message',
        configureServer(server) {
          server.httpServer?.once('listening', printWelcomeOnce)
        }
      }
    ].filter(Boolean)
  }
  return config
})
