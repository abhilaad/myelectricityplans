/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {      
        remotePatterns: [
          {
            
            hostname: 'cimet-uat-content-pub.s3.ap-southeast-2.amazonaws.com',          
          }
        ]
      }
};

export default nextConfig;
