// Disabled NextAuth middleware for serverless deployment
// export { default } from 'next-auth/middleware';

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/camera/:path*', 
//     '/history/:path*',
//     '/analytics/:path*',
//     '/compare/:path*',
//     '/export/:path*',
//     '/notifications/:path*',
//     '/settings/:path*'
//   ]
// };

// Simple middleware for serverless deployment
export function middleware() {
  // No authentication required - running as static site
  return;
} 