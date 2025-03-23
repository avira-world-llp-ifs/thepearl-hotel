/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com', 'res.cloudinary.com'],
  },
  async redirects() {
    return [
      // Add any redirects here if needed
    ]
  }
}

export default nextConfig

