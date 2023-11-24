import { IEntry, IFolder } from './FileSystem';

export class ShiftSelectionManager {
  private start: number;
  private end: number;
  private prevSelection: number[] = [];

  public constructor() {
    this.reset();
  }

  public setStart(start: number): void {
    this.reset();
    this.start = Math.max(start, 0);
  }

  public setEnd(end: number): void {
    this.end = end;
  }

  public reset(): void {
    this.start = 0;
    this.end = -1;
    this.prevSelection.splice(0);
  }

  public getPrevSelection(): number[] {
    return this.prevSelection;
  }

  public getSelection(orderedSelection: boolean[]): number[] {
    let start: number;
    let end: number;

    if (this.end === -1) {
      return [];
    }
    if (this.end < this.start) {
      start = this.end;
      end = this.start + 1;
    }
    else {
      start = this.start;
      end = this.end + 1;
    }
    const range = Array.from({ length: (end - start) }, (v, k) => k + start);

    // For each shift selection action: if the Shift key is still held, the end shift pos can change
    // with the previously (before-shift) selected elements still selected while the current shift selections unselect.
    const specificSelection = range.filter(idx => !(orderedSelection[idx]));
    this.prevSelection = specificSelection;
    return specificSelection;
  }
}

export interface DashboardState {
  root(rootFolder?: IFolder): IFolder | null;
  setEntries(entries: IEntry[]): void;
  getEntries(): IEntry[];
  getIndexByEntryName(name: string): number;
  setSelection(index: number, bool: boolean): void;
  getSelection(): boolean[];
  resetSelection(): void;
  setFolderPath(path: IFolder[]): void;
  getFolderPath(): IFolder[];
  getFolderPathNames(): string[];
  getFolderPathByNames(folderNames: string[]): IFolder | void;
  getParentFolder(): IFolder | undefined;
  getTrashFolder(): IFolder;
  getSelectedEntries(): IEntry[];
  getSelectedFolders(): IEntry[];
  getSelectedTrash(): IEntry[];
  getSelectedFiles(): IEntry[];
  isInTrash(): boolean;
}

export function dashboardState(): DashboardState {
  // as displayed on the dashboard
  let orderedEntries: IEntry[] = [];
  let orderedSelection: boolean[] = [];
  // const currentFileSelection = []; // currently user-selected files
  // const currentFolderSelection = []; // currently user-selected folders

  // path leading to current folder
  let folderPath: IFolder[] = [];
  let _root: IFolder = null;

  /** 
   * Sets or gets the root folder
   * @param rootFolder (optional) - the root folder to set
   * @returns the root folder
   */ 
  function root(rootFolder?: IFolder) {
    if (rootFolder) _root = rootFolder;
    return _root;
  }

  function setEntries(entries: IEntry[]) {
    orderedEntries = entries;
    orderedSelection = Array(entries.length).fill(false);
  }

  function getEntries() {
    return orderedEntries;
  }

  function getIndexByEntryName(name: string) {
    return orderedEntries.findIndex(entry => entry.name === name);
  }

  function setSelection(index: number, bool: boolean) {
    orderedSelection[index] = bool;
  }

  function getSelection() {
    return orderedSelection;
  }

  function resetSelection() {
    orderedSelection.fill(false);
  }

  function setFolderPath(path: IFolder[]) {
    folderPath = path;
  }

  function getFolderPath() {
    return folderPath;
  }

  function getFolderPathNames() {
    return folderPath.map(folder => folder.name);
  }

  function getFolderPathByNames(folderNames: string[]): IFolder | void {
    let currentFolder = root();
    folderNames = folderNames.slice(1);

    for (const folderName of folderNames) {
      const targetFolder = currentFolder.children.find(child => child.name === folderName);
      if (targetFolder && targetFolder.type === 'folder') {
        currentFolder = targetFolder as IFolder;
      } else {
        console.debug('failed to find folder: ', folderName);
        return;
      }
    }

    return currentFolder;
  }


  function getParentFolder() { 
    return folderPath.at(-1); 
  }

  function getTrashFolder() {
    const trashFolders = root().children.filter(entry => entry.type === 'trash') as IFolder[];
    return trashFolders[0];
  }

  function getSelectedEntries() {
    return orderedEntries.filter((_, idx) => orderedSelection[idx]);
  }

  function getSelectedFolders() {
    return getSelectedEntries().filter(entry => entry.type === 'folder');
  }

  function getSelectedTrash() {
    return getSelectedEntries().filter(entry => entry.type === 'trash');
  }

  function getSelectedFiles() {
    return getSelectedEntries().filter(entry => entry.type === 'file');
  }

  function isInTrash() {
    const isTrashFolder = (folder: IFolder): boolean => folder.type === 'trash';
    return getFolderPath().some(isTrashFolder);
  }

  // TODO:
  // function sortEntries() {}

  return {
    root: root,
    setEntries: setEntries,
    getEntries: getEntries,
    getIndexByEntryName: getIndexByEntryName,
    setSelection: setSelection,
    getSelection: getSelection,
    resetSelection: resetSelection,
    setFolderPath: setFolderPath,
    getFolderPath: getFolderPath,
    getFolderPathNames: getFolderPathNames,
    getFolderPathByNames: getFolderPathByNames,
    getParentFolder: getParentFolder,
    getTrashFolder: getTrashFolder,
    getSelectedEntries: getSelectedEntries,
    getSelectedFolders: getSelectedFolders,
    getSelectedTrash: getSelectedTrash,
    getSelectedFiles: getSelectedFiles,
    isInTrash: isInTrash,
  };
}