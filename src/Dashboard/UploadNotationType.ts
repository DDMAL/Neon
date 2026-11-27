export type UploadNotationType = 'square' | 'hufnagel';

const STORAGE_KEY = 'neon-upload-notation-type';
const DEFAULT_NOTATION_TYPE: UploadNotationType = 'square';

export function getUploadNotationType(): UploadNotationType {
  const storedNotationType = window.localStorage.getItem(STORAGE_KEY);
  return storedNotationType === 'hufnagel' || storedNotationType === 'square'
    ? storedNotationType
    : DEFAULT_NOTATION_TYPE;
}

export function setUploadNotationType(notationType: string): void {
  if (notationType !== 'hufnagel' && notationType !== 'square') return;
  window.localStorage.setItem(STORAGE_KEY, notationType);
}
