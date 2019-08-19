declare module '*.rng' {
  const rng: Promise<any>;
  export default rng;
}

declare module '*.png' {
  const path: string;
  export default path;
}

declare module '*.svg' {
  const path: string;
  export default path;
}

declare module '*.html' {
  const contents: string;
  export default contents;
}
