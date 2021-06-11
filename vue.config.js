const {InjectManifest, GenerateSW} = require('workbox-webpack-plugin');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    name: 'PetX',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      // swSrc: 'dev/sw.js',
      // ...other Workbox options...
    }
  }
}
