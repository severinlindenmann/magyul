const { override } = require('customize-cra');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const path = require('path');

module.exports = override(
  (config) => {
    // Remove any existing Workbox plugins (GenerateSW or InjectManifest)
    config.plugins = config.plugins.filter(
      plugin => 
        !(plugin instanceof WorkboxWebpackPlugin.GenerateSW) &&
        !(plugin.constructor.name === 'GenerateSW') &&
        !(plugin.constructor.name === 'InjectManifest')
    );

    // Add our custom InjectManifest plugin
    config.plugins.push(
      new WorkboxWebpackPlugin.InjectManifest({
        swSrc: path.resolve(__dirname, 'src/service-worker.ts'),
        swDest: 'service-worker.js',
        exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        // Tell Workbox to compile the TypeScript source
        webpackCompilationPlugins: [],
      })
    );

    return config;
  }
);
