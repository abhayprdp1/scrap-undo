/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude TensorFlow.js from server-side bundle — it needs browser APIs (canvas, HTMLImageElement)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        '@tensorflow/tfjs',
        '@tensorflow-models/coco-ssd',
        '@tensorflow-models/mobilenet',
      ];
    }
    return config;
  },
};

export default nextConfig;
