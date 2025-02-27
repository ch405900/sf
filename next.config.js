/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
        tsconfigPath: './tsconfig.json'
    },
    staticPageGenerationTimeout: 1800,
    i18n: {
        locales: ['en', 'zh'], // 只保留需要的语言
        defaultLocale: 'en'
    },
    // 阻止自动检测语言（减少预生成路径）
    localeDetection: false,
    experimental: {
        granularChunks: {
            i18n: 'lazy' // 延迟加载语言包
        }
    }
};

module.exports = nextConfig;
