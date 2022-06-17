export function formatFilename(filename: string, maxLen: number) {
  const chunkLen = Math.floor(maxLen/2);
  const len = filename.length;
  if (len <= maxLen) return filename;
  else return `${filename.substring(0,chunkLen-1)}...${filename.substring(len-chunkLen+2, len)}`;
}

export function renderUploadingContainer() {
  const container = document.getElementById('uploading_container') as HTMLDivElement;
  container.style.display = 'block';
}
