const fs = require('fs').promises;
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/** @type {import("next").NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  basePath: isProduction ? '/next-github-pages' : '',
  assetPrefix: isProduction ? '/next-github-pages/' : '',

  output: 'export',
};

module.exports = nextConfig;
