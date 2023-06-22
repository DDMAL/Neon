import { GroupingType, SelectionType, UserType, InsertType, InsertTabType } from '../Types';

/**
 * The one instance of LocalSettings that will be created and
 * used by the editor.
 * 
 * Use the functions `getSettings()` and `setSettings()`
 * to access this instance.
 */
let localSettings: LocalSettings = null;

/**
 * Interface for the settings for each folio
 * stored in localStorage.
 *
 * Every key is optional so that this same typing
 * can be used for `setSettings()` / `LocalSettings.set()`.
 */
export interface Settings {
  zoom: number;
  glyphOpacity: number;
  imageOpacity: number;
  highlightMode: GroupingType;
  userMode: UserType;
  insertMode: InsertType;
  insertTab: InsertTabType;
  selectionMode: SelectionType;
  displayBBox: boolean;
  displayText: boolean;
  displayInfo: boolean;
  displayErrLog: boolean;
  viewBox: string;
}

/**
 * Default settings, which should be set for a folio with no
 * localStorage value.
 *
 * This should be updated alongside the interface `Settings`
 * any time we want to add a new setting to store in localStorage.
 */
const DEFAULT_SETTINGS: Settings = {
  zoom: 100,
  glyphOpacity: 100,
  imageOpacity: 100,
  highlightMode: 'none',
  userMode: 'viewer',
  insertMode: 'punctum',
  insertTab: 'primitiveTab',
  selectionMode: 'selBySyllable',
  displayBBox: false,
  displayText: false,
  displayInfo: false,
  displayErrLog: false,
  viewBox: null
};

class LocalSettings {
  id: string;
  settings: Settings;

  constructor (folioId: string) {
    localSettings = this;
    this.id = folioId;
    this.load();
  }

  /**
   * Load settings from localStorage, and sync loaded settings with
   * new fields that may not be in localStorage.
   */
  load (): void {
    try {
      const stored: Partial<Settings> = JSON.parse(window.localStorage.getItem(this.id));
      this.sync(stored);
    } catch (error) {
      // If localStorage value is not a JSON object (for instance, an empty string),
      // a SyntaxError will be thrown. We must handle it by calling sync()
      // with an empty JSON object.
      this.sync({});
    }
  }

  /**
   * Set new fields in localStorage, as a "union" of old and new settings.
   */
  set (params: Partial<Settings>): void {
    this.settings = { ...this.settings, ...params };
    window.localStorage.setItem(this.id, JSON.stringify(this.settings));
  }

  /**
   * Sync settings that may not be included in user's localStorage,
   * such as fields that have been added to localStorage in a new
   * update of Neon.
   */
  sync (stored: Partial<Settings>): void {
    this.settings = { ...DEFAULT_SETTINGS, ...stored };
    window.localStorage.setItem(this.id, JSON.stringify(this.settings));
  }
}

/**
 * Get localStorage settings for the folio.
 */
export function getSettings (): Settings {
  return localSettings.settings;
}

/**
 * Set specific localStorage settings for the folio.
 */
export function setSettings (params: Partial<Settings>): void {
  localSettings.set(params);
}

export default LocalSettings;
