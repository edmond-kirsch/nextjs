/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate');
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
  future: {
    webpack5: true,
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, 
      fs: false,
    };

    return config;
  },
}

module.exports = nextTranslate(nextConfig);
