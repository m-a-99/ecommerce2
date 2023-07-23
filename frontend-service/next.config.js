/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["nginx-proxy","localhost","file-service"], //make it 'your-domain.com'
  },
};
