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

  async exportPathMap() {
    const files = await getFilesInDirectory(pagesDirectory);

    return files.reduce((acc, filePath) => {
      const route = filePath.replace(/\/index$/, ''); // 把 /index 替换为 /

      // Avoid special Next.js files and API routes
      if (
        !route.includes('/[') &&
        !route.includes('_') &&
        !route.includes('/api')
      ) {
        if (!route.startsWith('/')) {
          console.error(`Invalid page path: ${route}`);
        } else {
          acc[route] = {
            page: filePath,
          };
        }
      }

      return acc;
    }, {});
  },
};

module.exports = nextConfig;
