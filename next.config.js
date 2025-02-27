/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
        tsconfigPath: './tsconfig.json'
    },
    staticPageGenerationTimeout: 1800,
    experimental: {
        granularChunks: {
            i18n: 'lazy' // 延迟加载语言包
        }
    }
};

module.exports = nextConfig;
