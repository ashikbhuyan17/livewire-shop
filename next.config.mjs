/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/login', destination: '/signin' },
      { source: '/account', destination: '/user/account' },
      { source: '/account/:path*', destination: '/user/:path*' },
      { source: '/wishlist', destination: '/user/wishlist' },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'danpite.tech',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'italy.danpitetech.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'italy.mamatazshop.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'panel.bestfoodcity.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'italy.babuei.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dazzle.com.bd',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dazzle.sgp1.cdn.digitaloceanspaces.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-8b3adcede6394a9fb244e806bff419ee.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'livewire.zariyafashionbd.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
