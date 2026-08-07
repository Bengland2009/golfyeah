// __APP_VERSION__ is injected at build time from package.json (see vite.config.js).
export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0';
