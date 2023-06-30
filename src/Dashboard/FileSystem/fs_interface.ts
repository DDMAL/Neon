export enum EntryType {
    Folder = 'folder',
    File = 'file'
}

export interface IEntry {
    name: string;
    type: EntryType;
    content: IEntry[] | string;
    metadata: { [key: string]: any };
}

export interface IFolder extends IEntry {
    type: EntryType.Folder;
    content: IEntry[];
}

export interface IFile extends IEntry {
    type: EntryType.File
    content: string;
}