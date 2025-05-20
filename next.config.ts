import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


const nextConfig: NextConfig = {

    eslint: {
    // Warning during builds will cause build to fail
    ignoreDuringBuilds: false,
  },
  
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.node$/,
      type: 'asset/resource',
    });
    

    return config;
  },

  reactStrictMode: false,
};

module.exports = nextConfig;
