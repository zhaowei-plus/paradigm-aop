const path = require('path')

module.exports = {
  publicPath: '/paradigm-aop/src/vue-demo/dist',
  chainWebpack: config => {
    config.resolve.alias.set('@', path.resolve('src'))
  },
  devServer: {
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      "/mock": {
        target: 'http://10.204.210.101:3000/mock/30',
        changeOrigin: true,
        secure: false,
      }
    }
  }
 }