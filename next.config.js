/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['duckdb'],
  },
}

module.exports = nextConfig
