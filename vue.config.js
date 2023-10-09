// eslint-disable-next-line @typescript-eslint/no-var-requires
const CompressionPlugin = require("compression-webpack-plugin")
console.log(process.env.NODE_ENV)
module.exports = {
  transpileDependencies: ['webpack-dev-server/client'],
  // publicPath: process.env.NODE_ENV === 'development' ? '/' : "/vue-admin-work-x",
  publicPath: './',
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    hot: true,
    port: 8040,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api/*': {
        // target: 'http://localhost:8765/',
        target: 'http://10.16.64.245:8765/',
        // target: 'http://ltc.cloud-hb.com/',
        // target: 'http://nw.tbea-hb.com.cn/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      },
      '/docrest/file/*': {
        target: 'https://ejia.tbea.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/docrest/file': '/docrest/file'
        }
      },
      //图片代理地址
      '/minioServer/*': {
        target: 'http://10.16.9.128:9000/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/minioServer': ''
        }
      },
      //图片代理地址
      '/fileNewServer/*': {
        target: 'http://nw.tbea-hb.com.cn/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/fileNewServer': '/fileServer'
        }
      },
      //图片代理地址
      '/fileServer/*': {
        target: 'http://nw.tbea-hb.com.cn/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/fileServer': ''
        }
      },
    }
  },
  configureWebpack: {
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    }
  },
  chainWebpack(config) {
    config.entry.app = ['babel-polyfill', './src/main.js'];
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin')
        .use(new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.js$|\.html$|\.css/,
          threshold: 50240,
          deleteOriginalAssets: false
        }))
    }
  }
};
