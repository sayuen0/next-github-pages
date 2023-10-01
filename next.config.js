const { promises: fsPromises } = require('fs');
const path = require('path');

/** @type {import("next").NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  basePath: isProduction ? process.env.BASE_PATH : '',
  assetPrefix: isProduction ? process.env.ASSET_PREFIX : '',

  async exportPathMap() {
    const filePaths = await fsPromises.readdir(path.join(__dirname, './pages'));
    const pagePaths = filePaths.map(
      (filePath) => `/${filePath.replace('.js', '')}`,
    );

    // Convert file paths to export path map
    return pagePaths.reduce((acc, curr) => {
      // Skip certain filenames or directories as required
      if (curr.startsWith('/_') || curr.match(/[A-Z]/)) {
        return acc;
      }

      return {
        ...acc,
        [curr]: {
          page: curr,
        },
      };
    }, {});
  },
};
