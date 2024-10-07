/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/action/asset/v1/upload/:identifier*', // Match asset upload routes
        destination: '/api/fileUpload', // Forward asset uploads to fileUpload.js
      },
      {
        source: '/action/asset/:path*', // Match other /action/asset routes
        destination: '/api/proxy?path=/action/asset/:path*', // Forward other /action/asset requests to proxy.js
      },
      {
        source: '/action/:path*', // Match any other routes starting with /action/
        destination: '/api/proxy?path=/action/:path*', // Forward them to proxy.js
      },
      {
        source: '/api/:path*', // Match /api/ routes
        destination: '/api/proxy?path=/api/:path*', // Forward them to proxy.js
      },
      {
        source: '/assets/public/:path*', // Match any URL starting with /assets/public/
        destination: 'https://knowlg-public.s3-ap-south-1.amazonaws.com/:path*', // Forward to S3, stripping "/assets/public"
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      jquery: "jquery/src/jquery",
    };
    return config;
  },
};

export default nextConfig;
