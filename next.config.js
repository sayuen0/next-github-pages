const fs = require('fs').promises;
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  swSrc: 'service-worker.js',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  //next.js config
  reactStrictMode: true,
});
