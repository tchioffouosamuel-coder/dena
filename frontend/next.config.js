/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      // Ajoutez ici le domaine de production de l'API (ex: api.dena.cm)
    ],
  },
};
module.exports = nextConfig;
