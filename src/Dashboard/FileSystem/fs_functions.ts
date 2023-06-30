import { EntryType, IEntry, IFolder, IFile } from '.';

/*
*   File System Functions that are used to create, move, and delete file system entries
*   Does not depend on state 
*/

const createEntry = (name: string, type: EntryType, content: IEntry[] | string): IEntry => {
    const metadata = {};
    const entry = { name, type, content, metadata } as IEntry;
    return entry;
}

const createFolder = (name: string): IFolder => {
    return createEntry(name, EntryType.Folder, []) as IFolder;
}

const createFile = (name: string, content: string): IFile => {
    return createEntry(name, EntryType.File, content) as IFile;
}

const createRoot = (name: string, content: IEntry[]): IFolder => {
    return createEntry(name, EntryType.Folder, content) as IFolder;
}

function addMetadata(entry: IEntry, metadata: Record<string, any>): IEntry {
    Object.entries(metadata).forEach(([key, value]) => {
        entry.metadata[key] = value
    });
    return entry;
}

function removeMetadata(entry: IEntry, keys: string[]): IEntry {
    keys.forEach((key) => {
        delete entry.metadata[key];
    });
    return entry;
}
    
function moveEntry(entry: IEntry, parent: IFolder, newParent: IFolder): boolean {
    try {
        addEntry(entry, newParent);
        removeEntry(entry, parent);
    } catch (e) {
        console.error(e);
        window.alert(`Error moving ${entry.name} to ${newParent.name}`);
        return false;
    }
    return true;
}

const addEntry = (entry: IEntry, parent: IFolder): boolean => {
    try {
        // Check for duplicate name
        const isDuplicate = parent.content.some((e) => e.name === entry.name);
        if (isDuplicate) {
            window.alert(`Error adding ${entry.name} to ${parent.name}: duplicate name`);
            return false;
        }

        // Add entry to parent
        parent.content.push(entry);
        parent.content.sort((a, b) => a.type.localeCompare(b.type));
        parent.content.sort((a, b) => a.name.localeCompare(b.name));
    } catch (e) {
        console.error(e);
        window.alert(`Error adding ${entry.name} to ${parent.name}`);
        return false;
    }
    return true;
}

const removeEntry = (entry: IEntry, parent: IFolder): boolean => {
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
    createFile: createFile,
    moveEntry: moveEntry,
    addEntry: addEntry,
    removeEntry: removeEntry,
    addMetadata: addMetadata,
    removeMetadata: removeMetadata
}