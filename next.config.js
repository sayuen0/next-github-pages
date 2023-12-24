const fs = require('fs').promises;
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/** @type {import("next").NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  basePath: isProduction ? '/next-github-pages' : '',
  assetPrefix: isProduction ? '/next-github-pages/' : '',

  output: 'export',

  async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      '/': { page: '/' },
      '/ultimate': { page: '/ultimate' },
      // other custom paths
    };
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [{ from: 'public/static', to: 'static' }],
        }),
      );
    }
    // パスエイリアスの設定
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    return config;
  },
};

module.exports = nextConfig;
