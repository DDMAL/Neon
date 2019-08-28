declare module '*.rng' {
  const rng: Promise<any>;
  export default rng;
}

declare module '*.html' {
  const contents: string;
  export default contents;
}

declare const __ASSET_PREFIX__: string;
declare const __LINK_LOCATION__: string;
declare const __NEON_VERSION__: string;
