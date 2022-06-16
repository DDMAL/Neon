export function formatFilename(filename: string, maxLen: number) {
  const chunkLen = Math.floor(maxLen/2);
  const len = filename.length;
  if (len <= maxLen) return filename;
  else return `${filename.substring(0,chunkLen)}...${filename.substring(len-chunkLen, len)}`;
}

export function renderUploadingContainer() {
  const container = document.getElementById('uploading_container') as HTMLDivElement;
  container.style.display = 'block';
}
