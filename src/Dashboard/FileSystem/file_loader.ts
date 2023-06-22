import { EntryType, IEntry, IFolder, IFile } from '.';

const createEntry = (name: string, type: EntryType, content: IEntry[] | string): IEntry => {
    return {
        name,
        type,
        content,
        parent: null,
    };
}

const createFolder = (name: string): IFolder => {
    return createEntry(name, EntryType.Folder, []) as IFolder;
}

const createFolio = (name: string, content: string): IFile => {
    return createEntry(name, EntryType.Folio, content) as IFile;
}

const createManuscript = (name: string, content: string): IFile=> {
    return createEntry(name, EntryType.Manuscript, content) as IFile;
}

const createRoot = (name: string, content: IEntry[]): IFolder => {
    return createEntry(name, EntryType.Folder, content) as IFolder;
}

const moveEntry = (entry: IEntry, parent: IFolder, newParent: IFolder): boolean => {
    try {
        AddEntry(entry, newParent);
        RemoveEntry(entry, parent);
    } catch (e) {
        console.error(e);
        window.alert(`Error moving ${entry.name} to ${newParent.name}`);
        return false;
    }
    return true;
}

const AddEntry = (entry: IEntry, parent: IFolder): boolean => {
    try {
        const AssignedEntry = { ...entry, parent: parent };

        // Check for duplicate name
        const isDuplicate = parent.content.some((e) => e.name === entry.name);
        if (isDuplicate) {
            window.alert(`Error adding ${entry.name} to ${parent.name}: duplicate name`);
            return false;
        }

        // Add entry to parent
        parent.content.push(AssignedEntry);
        parent.content.sort((a, b) => a.type.localeCompare(b.type));
        parent.content.sort((a, b) => a.name.localeCompare(b.name));
    } catch (e) {
        console.error(e);
        window.alert(`Error adding ${entry.name} to ${parent.name}`);
        return false;
    }
    return true;
}

const RemoveEntry = (entry: IEntry, parent: IFolder): boolean => {
    try {
        // Check if entry exists in parent
        const idx = parent.content.findIndex((e) => e.name === entry.name);
        if (idx === -1) {
            window.alert(`Error removing ${entry.name} from ${parent.name}: entry not found`);
            return false;
        }

        // Remove entry from parent
        parent.content.splice(idx, 1);
    } catch (e) {
        console.error(e);
        window.alert(`Error removing ${entry.name} from ${parent.name}`);
        return false;
    }
    return true;
}



export const fs_functions = {
    createRoot: createRoot,
    createFolder: createFolder,
    createFolio: createFolio,
    createManuscript: createManuscript,
    moveEntry: moveEntry,
    AddEntry: AddEntry,
    RemoveEntry: RemoveEntry,
}