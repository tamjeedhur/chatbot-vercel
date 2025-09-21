const nextConfig = {
  transpilePackages: ['cheerio'],
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark undici as external so it isn't processed by webpack
      config.externals = config.externals || [];
      config.externals.push('undici');
    }
    return config;
  },
};
module.exports = nextConfig;
