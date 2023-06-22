export enum EntryType {
    Folder = 'folder',
    Folio = 'folio',
    Manuscript = 'manuscript',
}
export interface IEntry {
    name: string;
    type: EntryType;
    content: IEntry[] | string;
    parent: IEntry;
}

export interface IFolder extends IEntry {
    type: EntryType.Folder;
    content: IEntry[];
}

export interface IFile extends IEntry {
    type: EntryType.Folio | EntryType.Manuscript;
    content: string;
}