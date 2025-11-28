// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;



const nextConfig = {
  experimental: {
    turbo: {}, // ✅ Disable Turbopack
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript:{
    ignoreBuildErrors:true,
  }
};

export default nextConfig;
