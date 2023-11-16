export enum EntryType {
  Folder = 'folder',
  Trash = 'trash',
  File = 'file'
}

export interface IEntry {
  name: string;
  type: EntryType;
  id: string;
  children: IEntry[];
  metadata: { [key: string]: unknown };
}

export interface IFolder extends IEntry {
  type: EntryType.Folder;
  id: string;
  children: IEntry[];
}

export interface IFile extends IEntry {
  type: EntryType.File
  id: string;
}