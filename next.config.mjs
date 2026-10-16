import withPWAInit from "@ducanh2912/next-pwa";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// Translations downloaded for offline use on first visit (~10 MB over the network, ~51 MB stored).
// Every other translation is saved the first time it's opened (runtime rule below).
const OFFLINE_TRANSLATIONS = ["kjv", "ta_offline", "hindi_offline", "net", "web", "asv", "kjvpce"];

// Content hash as the precache revision, so phones re-download a file only when it changes
const offlineTranslationEntries = OFFLINE_TRANSLATIONS.map((name) => ({
  url: `/${name}.json`,
  revision: createHash("md5").update(readFileSync(new URL(`./public/${name}.json`, import.meta.url))).digest("hex"),
}));

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // Registered by app/components/ServiceWorkerRegistration.js instead: the plugin's
  // workbox-window registration throws where service workers are blocked.
  register: false,
  // Don't precache the whole public folder's JSON (all 15 translations, ~105 MB);
  // only OFFLINE_TRANSLATIONS are added back via additionalManifestEntries.
  publicExcludes: ["!noprecache/**/*", "!*.json", "!book-details/**/*"],
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    additionalManifestEntries: offlineTranslationEntries,
    runtimeCaching: [
      {
        // public/<translation>.json — keep for offline reading once opened
        urlPattern: ({ url, sameOrigin }) =>
          sameOrigin && /^\/[a-z0-9_]+\.json$/.test(url.pathname) && url.pathname !== "/manifest.json",
        handler: "CacheFirst",
        options: {
          cacheName: "bible-translations",
          expiration: { maxEntries: 20, purgeOnQuotaError: true },
          cacheableResponse: { statuses: [200] },
        },
      },
      {
        urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/book-details/"),
        handler: "CacheFirst",
        options: {
          cacheName: "book-details",
          expiration: { maxEntries: 80, purgeOnQuotaError: true },
          cacheableResponse: { statuses: [200] },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https://*.tile.openstreetmap.org https://tile.openstreetmap.org; media-src 'self' https://api.dictionaryapi.dev https://ssl.gstatic.com https://commons.wikimedia.org blob: data:; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://api.dictionaryapi.dev https://www.hebcal.com https://nominatim.openstreetmap.org https://bible-api.com; frame-src 'self' https://www.openstreetmap.org https://*.openstreetmap.org; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests;" }
        ]
      }
    ];
  }
};

export default withPWA(nextConfig);
