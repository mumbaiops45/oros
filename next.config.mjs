/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    // Every image in this project is a first-party SVG served from /public.
    // No remotePatterns are configured, so the optimiser can never be pointed
    // at third-party SVG. The CSP below sandboxes them regardless.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
