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
};

module.exports = nextConfig;
