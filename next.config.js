/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    // Add a specific rule for handling WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });
    
    return config;
  },
}

module.exports = nextConfig 