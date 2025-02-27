/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')
const nextConfig = {
    // output: 'export',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
        tsconfigPath: './tsconfig.json'
    },
    staticPageGenerationTimeout: 1800,
    i18n, // 👈🏻 合并国际化配置
};

module.exports = nextConfig;
