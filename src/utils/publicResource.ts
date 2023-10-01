export function getResourcePath(resourcePath: string): string {
  const publicPath = process.env.PUBLIC_PATH || '';
  return `${publicPath}${
    resourcePath.startsWith('/') ? '' : '/'
  }${resourcePath}`;
}
