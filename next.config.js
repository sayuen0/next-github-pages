const fs = require('fs').promises;
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/** @type {import("next").NextConfig} */

const nextConfig = {
  output: 'export',
};

module.exports = nextConfig;
