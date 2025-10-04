const { override } = require('customize-cra');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const path = require('path');

module.exports = override((config) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Defensive: count existing InjectManifest plugins
  const existingInjects = config.plugins.filter(p => p && p.constructor && p.constructor.name === 'InjectManifest');

  // Remove CRA's GenerateSW & stray InjectManifest duplicates
  if (existingInjects.length > 1 || !isProduction) {
    config.plugins = config.plugins.filter(
      plugin => !(
        plugin instanceof WorkboxWebpackPlugin.GenerateSW ||
        plugin?.constructor?.name === 'GenerateSW' ||
        plugin?.constructor?.name === 'InjectManifest'
      )
    );
  }

  // Only add our InjectManifest once (prefer production; allow dev opt-in via FORCE_SW)
  const shouldAdd = isProduction || process.env.FORCE_SW === 'true';
  if (shouldAdd) {
    const already = config.plugins.some(p => p?.constructor?.name === 'InjectManifest');
    if (!already) {
      config.plugins.push(
        new WorkboxWebpackPlugin.InjectManifest({
          swSrc: path.resolve(__dirname, 'src/service-worker.ts'),
          swDest: 'service-worker.js',
          exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          webpackCompilationPlugins: [],
        })
      );
    }
  }

  return config;
});
