/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
      {
        source:'/component/tweet',
        destination:'/home?modal=tweet',
        permanent : true,
        basePath:false,
      },
    ]
  },
}

module.exports = nextConfig
