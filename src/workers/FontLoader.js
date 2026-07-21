const fontBase64Promises = new Map();

function fetchFontBase64(url) {
  if (!fontBase64Promises.has(url)) {
    const base64Promise = fetch(url)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
      });
    fontBase64Promises.set(url, base64Promise);
  }
  return fontBase64Promises.get(url);
}
