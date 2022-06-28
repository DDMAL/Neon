interface Settings {
  zoom?: number;
  glyphOpacity?: number;
  imageOpacity?: number;
  highlightMode?: string;

  displayBBox?: boolean;
  displayText?: boolean;
  displayInfo?: boolean;
}

let localSettings: LocalSettings = null;

class LocalSettings {
  id: string;
  settings: Settings;

  constructor (folioId: string) {
    localSettings = this;
    this.id = folioId;
    this.load();
  }

  /** Load settings from localStorage; if it does not exist, create and store
    *   new settings in localStorage
    */
  load (): void {
    const stored = JSON.parse(window.localStorage.getItem(this.id));

    if (!stored) {
      const newSettings: Settings = {
        zoom: 100,
        glyphOpacity: 100,
        imageOpacity: 100,
        highlightMode: 'highlight-none',

        displayBBox: false,
        displayText: false,
        displayInfo: false,
      };

      window.localStorage.setItem(this.id, JSON.stringify(newSettings));
      this.settings = newSettings;
    } else {
      this.settings = stored;
    }
  }

  set (params: Settings): void {
    this.settings = { ...this.settings, ...params };
    window.localStorage.setItem(this.id, JSON.stringify(this.settings));
  }
}

export function getSettings (): Settings {
  return localSettings.settings;
}

export function setSettings (params: Settings): void {
  localSettings.set(params);
}

export default LocalSettings;
