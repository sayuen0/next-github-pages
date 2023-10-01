const path = require('path');
const fs = require('fs').promises;

/** @type {import("next").NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const pagesDirectory = path.join(__dirname, 'src/pages');

async function getFilesInDirectory(dir) {
  const files = await fs.readdir(dir);
  const fileAndDirectoryPaths = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(dir, file);
      const isDirectory = (await fs.stat(fullPath)).isDirectory();
      if (isDirectory) {
        return getFilesInDirectory(fullPath);
      } else {
        return [fullPath.replace(/\.tsx$/, '').replace(pagesDirectory, '')];
      }
    }),
  );
  return fileAndDirectoryPaths.flat();
}

const nextConfig = {
  basePath: isProduction ? process.env.BASE_PATH : '',
  assetPrefix: isProduction ? process.env.ASSET_PREFIX : '',

  output: 'export',

  async exportPathMap() {
    const files = await getFilesInDirectory(pagesDirectory);

    const paths = files.reduce((acc, filePath) => {
      if (filePath === '/index') {
        console.log('Root path mapped to: ', filePath); // Add debug log
        acc['/'] = { page: '/' };
      } else if (
        !filePath.includes('/[') &&
        !filePath.includes('_') &&
        !filePath.includes('/api')
      ) {
        acc[filePath] = {
          page: filePath,
        };
      }

      return acc;
    }, {});

    return paths;
  },
};

module.exports = nextConfig;
