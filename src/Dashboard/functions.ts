export function formatFilename(filename: string, maxLen: number): string {
  const chunkLen = Math.floor(maxLen/2);
  const len = filename.length;
  if (len <= maxLen) return filename;
  else return `${filename.substring(0,chunkLen-1)}...${filename.substring(len-chunkLen+2, len)}`;
}