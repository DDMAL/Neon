import { getNotationType } from './ConvertMei';

export type NotationType = 'square' | 'hufnagel';

/**
 * The notation type of each document's saved MEI, keyed by manifest @id, so
 * the dashboard can label files without loading every document.
 *
 * The saved MEI is the only source: recordNotationType takes the MEI itself
 * and is the only way to write a value. It is called wherever saved MEI is
 * written or read back - on upload, on save in the editor, and when the
 * editor first loads a document - so a value can never come from the upload
 * choice or from unsaved edits.
 *
 * Kept under its own key rather than in the dashboard's file system metadata,
 * because the dashboard rewrites that whole tree on every change and would
 * overwrite a value the editor recorded in another tab.
 */
const STORAGE_KEY = 'neon-notation-types';

function readAll(): Record<string, NotationType> {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return stored && typeof stored === 'object' ? stored : {};
  } catch {
    return {};
  }
}

function writeAll(types: Record<string, NotationType>): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(types));
}

/**
 * Record the notation type that a document's saved MEI declares.
 */
export function recordNotationType(id: string, mei: string): void {
  const types = readAll();
  types[id] = getNotationType(mei);
  writeAll(types);
}

/**
 * @returns The recorded notation type, or undefined if the document has not
 * been uploaded or opened since notation types were recorded.
 */
export function getRecordedNotationType(id: string): NotationType | undefined {
  const type = readAll()[id];
  return type === 'square' || type === 'hufnagel' ? type : undefined;
}

/**
 * Forget a document's notation type once the document itself is deleted.
 */
export function forgetNotationType(id: string): void {
  const types = readAll();
  if (!(id in types)) return;
  delete types[id];
  writeAll(types);
}
