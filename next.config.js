/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@tensorflow/tfjs-node'],
  },
  images: {
    domains: ['api.mapbox.com'],
  },
  env: {
    TF_CPP_MIN_LOG_LEVEL: '3',
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@tensorflow/tfjs-node');
    }
    return config;
  },
}

module.exports = nextConfig 