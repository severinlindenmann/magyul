/// <reference lib="webworker" />

declare module 'workbox-precaching' {
  export function precacheAndRoute(entries: any[]): void;
  export function createHandlerBoundToURL(url: string): any;
}

declare module 'workbox-routing' {
  export function registerRoute(
    capture: RegExp | string | ((options: any) => boolean),
    handler: any
  ): void;
}

declare module 'workbox-strategies' {
  export class StaleWhileRevalidate {
    constructor(options?: any);
  }
  export class CacheFirst {
    constructor(options?: any);
  }
}

declare module 'workbox-expiration' {
  export class ExpirationPlugin {
    constructor(options?: any);
  }
}

declare module 'workbox-core' {
  export function clientsClaim(): void;
}

declare global {
  interface ServiceWorkerGlobalScope {
    __WB_MANIFEST: any[];
  }
}
