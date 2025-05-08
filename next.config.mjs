
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     missingSuspenseWithCSRBailout: false,
//   },
//   images: {
//     domains: ['api.acadally.com'],
// },


//   webpack: (config, { isServer, webpack }) => {
//     if (!isServer) {  // Only add ProvidePlugin on the client-side
//       config.plugins.push(
//         new webpack.ProvidePlugin({
//           $: 'jquery',
//           jQuery: 'jquery',
//           'window.jQuery': 'jquery',
//         })
//       );
//     }
//     return config;
//   },
// };

// export default nextConfig;







/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: ["api.acadally.com","crm.acadally.com","leap2cdn-b8hhbrcsdugbacgc.z02.azurefd.net","plus.unsplash.com","thenamesfactory.com"],
  },
  webpack: (config, { isServer, webpack }) => {
    // Disable CSS source maps in production (you can also disable for dev if you prefer)
    if (!isServer) {
      config.module.rules.forEach((rule) => {
        if (rule.test && rule.test.toString().includes('css')) {
          rule.use.forEach((use) => {
            if (use.loader && use.loader.includes('css-loader')) {
              use.options = {
                ...use.options,
                sourceMap: false,  // Disable CSS source maps
              };
            }
          });
        }
      });
    }

    // Add ProvidePlugin for jQuery only on the client-side
    if (!isServer) {
      config.plugins.push(
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery',
        })
      );
    }

    return config;
  },
};

export default nextConfig;






















// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     webpack: (config, { webpack }) => {
//       config.plugins.push(
//         new webpack.ProvidePlugin({
//           $: 'jquery',
//           jQuery: 'jquery',
//           'window.jQuery': 'jquery',
//         })
//       );
//       return config;
//     },
//   };
  
// // //   module.exports = nextConfig;
//   export default nextConfig;


//   /** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack: (config, { isServer, webpack }) => {
//       // Only add ProvidePlugin for client-side builds
//       if (!isServer) {
//           config.plugins.push(
//               new webpack.ProvidePlugin({
//                   $: 'jquery',
//                   jQuery: 'jquery',
//                   'window.jQuery': 'jquery',
//               })
//           );
//       }
//       return config;
//   },
// };

// export default nextConfig;


//   /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     missingSuspenseWithCSRBailout: false,
//   },

//   // Proxy API calls
//   async rewrites() {
//     return [
//       {
//         source: '/api/onboarding/schools/',  // Proxy API calls starting with /api/onboarding/schools
//         destination: 'https://leap2.acadally.com/onboarding/schools/',  // Your actual API URL
//       },
//     ];
//   },

//   webpack: (config, { isServer, webpack }) => {
//     if (!isServer) {
//       config.plugins.push(
//         new webpack.ProvidePlugin({
//           $: 'jquery',
//           jQuery: 'jquery',
//           'window.jQuery': 'jquery',
//         })
//       );
//     }
//     return config;
//   },
// };

// export default nextConfig;
