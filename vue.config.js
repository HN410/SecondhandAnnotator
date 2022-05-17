const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ], 
  configureWebpack: {
    devtool: 'source-map'
  }, 
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
    }
   }
})
