/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Required for Solana wallet adapter packages
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};
module.exports = nextConfig;
