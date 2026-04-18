/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.NODE_ENV === 'development'
                    ? 'http://backend:8080/api/:path*'
                    : 'http://localhost:8080/api/:path*', // Proxy to Spring Boot
            },
        ]
    },
}

export default nextConfig