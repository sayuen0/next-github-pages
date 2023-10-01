/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
    basePath: isProduction ? process.env.BASE_PATH : "",
    assetPrefix: isProduction ? process.env.ASSET_PREFIX : "",

    exportPathMap: function () {
        return {
            "/": {page: "/"}
        }

    }
}

module.exports = nextConfig
