const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

const remotes = (isServer) => {
  const location = isServer ? "ssr" : "chunks";
  return {
    // Add remotes here if needed
  };
};

const PORTAL_BASE_URL = 'https://sunbird-editor.tekdinext.com'


const routes = {
  API: {
    GENERAL: {
      CONTENT_PREVIEW: "/content/preview/:path*",
      CONTENT_PLUGINS: "/content-plugins/:path*",
      GENERIC_EDITOR: "/generic-editor/:path*",
    },
  },

};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },
  async rewrites() {
    return [
      {
        source: "/action/asset/v1/upload/:identifier*", // Match asset upload routes
        destination: "/api/fileUpload", // Forward asset uploads to fileUpload.js
      },
      {
        source: "/action/content/v3/upload/url/:identifier*", // Match content upload with 'url' in the path
        destination:
          "/api/proxy?path=/action/content/v3/upload/url/:identifier*", // Forward to proxy route with path as query param
      },
      {
        source: "/action/content/v3/upload/:identifier*", // Match content upload routes
        destination: "/api/fileUpload", // Forward content uploads to fileUpload.js
      },
      {
        source: "/action/asset/:path*", // Match other /action/asset routes
        destination: "/api/proxy?path=/action/asset/:path*", // Forward other /action/asset requests to proxy.js
      },
      {
        source: "/action/content/:path*", // Match other /action/asset routes
        destination: "/api/proxy?path=/action/content/:path*", // Forward other /action/asset requests to proxy.js
      },
      {
        source: "/action/composite/v3/search", // Match telemetry route
        destination: "/api/composite-search", // Redirect to telemetry proxy
      },
      {
        source: "/action/:path*", // Match any other routes starting with /action/
        destination: "/api/proxy?path=/action/:path*", // Forward them to proxy.js
      },
      {
        source: "/api/:path*", // Match /api/ routes
        destination: "/api/proxy?path=/api/:path*", // Forward them to proxy.js
      },
      {
        source: "/assets/public/:path*", // Match any URL starting with /assets/public/
        destination: `${process.env.CLOUD_STORAGE_URL}/:path*`, // Forward to S3, stripping "/assets/public"
      },
      {
        source: "/workspace/content/assets/:path*", // Match any URL starting with /workspace/content/assets/
        destination: "/assets/:path*", // Serve the assets from the public folder
      },
      {
        source: routes.API.GENERAL.CONTENT_PREVIEW,
        destination: `${PORTAL_BASE_URL}${routes.API.GENERAL.CONTENT_PREVIEW}`, // Proxy to portal
      },
      {
        source: routes.API.GENERAL.CONTENT_PLUGINS,
        destination: `${PORTAL_BASE_URL}${routes.API.GENERAL.CONTENT_PLUGINS}`, // Proxy to portal
      },
      {
        source: routes.API.GENERAL.GENERIC_EDITOR,
        destination: `${PORTAL_BASE_URL}/:path*`, // Proxy to generic editor portal
      },
      {
        source: "/app/telemetry", // Match telemetry route
        destination: "/api/telemetry", // Redirect to telemetry proxy
      },
    ];
  },
  /**
   *
   * @param {import('webpack').Configuration} config
   * @returns {import('webpack').Configuration}
   */
  webpack(config, { isServer }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "./jquery.fancytree": require.resolve("./src/jquery.fancytree.js"), // Your fallback path
      "./jquery.fancytree.table": require.resolve("./src/jquery.fancytree.js"), // Your fallback path for the table
      "./jquery.fancytree.ui-deps": require.resolve(
        "./src/jquery.fancytree.js"
      ),
      "./jquery.fancytree.ui-deps": require.resolve(
        "./src/jquery.fancytree.js"
      ),
    };
    config.plugins.push(
      new NextFederationPlugin({
        name: "editor",
        filename: "static/chunks/remoteEntry.js",
        remotes: remotes(isServer),
        shared: {
          "@mui/material": {
            singleton: true,
            requiredVersion: false,
          },
          "@mui/icons-material": {
            singleton: true,
            requiredVersion: false,
          },
        },
        exposes: {
          "./Index": "./src/pages/index.tsx",
          "./Create": "/src/pages/workspace/content/create/index.tsx",
          "./Content": "/src/pages/workspace/content/allContents/index.tsx",
          "./Draft": "/src/pages/workspace/content/draft/index.tsx",
          "./Publish": "/src/pages/workspace/content/publish/index.tsx",
          "./Submitted": "/src/pages/workspace/content/submitted/index.tsx",
          "./Editor": "/src/pages/editor.tsx",
          "./UploadEditor": "/src/pages/upload-editor.tsx",
          "./Collection": "/src/pages/collection.tsx",
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
