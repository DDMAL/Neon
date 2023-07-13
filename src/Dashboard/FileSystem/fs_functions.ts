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

/**
 * Checks if entry can be added to parent folder
 * @param entry 
 * @param parent 
 * @returns true if can add, else false
 */
const canAddEntry = (entry: IEntry, parent: IFolder): boolean => {
    // Check for duplicate name
    const isDuplicate = parent.content.some((e) => e.name === entry.name);
    if (isDuplicate) return false;
    else return true;
}       

/**
 * Checks if entry can be removed from parent folder
 * @param entry 
 * @param parent 
 * @returns canRemove: boolean, index: number
 */
const canRemoveEntry = (entry: IEntry, parent: IFolder) => {
    // Check if entry exists in parent
    const idx = parent.content.findIndex((e) => e.name === entry.name);
    return { canRemove: idx !== -1, index: idx };
}

const canMoveEntry = (entry: IEntry, parent: IFolder, newParent: IFolder): boolean => {
    // Check if entry exists in parent
    const canAdd = canAddEntry(entry, newParent);
    console.log('canAdd', canAdd);
    const { canRemove, index }= canRemoveEntry(entry, parent);
    console.log('canRemove', canRemove);
    return (canAdd && canRemove);
}

const canRenameEntry = (entry: IEntry, parent: IFolder, newName: string): boolean => {
    // if newName is the same
    const isSameName = entry.name === newName;
    if (isSameName) return true;
    // Check if newName already exists in parent
    const names = getAllNames(parent);
    if (names.includes(newName)) return false;
    else return true;
}

/**
 * Adds entry to parent folder
 * @param entry
 * @param parent 
 * @returns true if added, else false
 */
const addEntry = (entry: IEntry, parent: IFolder): boolean => {
    try {
        const canAdd = canAddEntry(entry, parent);

        if (canAdd) {
            // Add entry to parent, sort by alphanumerical and folders before files
            parent.content.push(entry);
            sortFolder(parent);
            return true;
        }
        else {
            window.alert(`Duplicate name: ${entry.name} already exists in ${parent.name}.`);
            return false;
        }
    } catch (e) {
        console.error(e);
        window.alert(`Error adding ${entry.name} to ${parent.name}`);
        return false;
    }
}

/**
 * Removes entry from parent folder
 * @param entry 
 * @param parent 
 * @returns true if removed, else false
 */
const removeEntry = (entry: IEntry, parent: IFolder): boolean => {
    try {
        // Check if entry exists in parent
        const { canRemove, index } = canRemoveEntry(entry, parent);
        if (canRemove) {
            parent.content.splice(index, 1);
            return true;
        }
        else {
            window.alert(`${entry.name} does not exist in ${parent.name}.`);
            return false;
        }
    } catch (e) {
        console.error(e);
        window.alert(`Error removing ${entry.name} from ${parent.name}`);
        return false;
    }
}

/**
 * Moves entry from parent to newParent
 * @param entry 
 * @param parent 
 * @param newParent 
 * @returns true if moved, else false
 */
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

/**
 * Renames entry
 * @param entry 
 * @param parent 
 * @param newName 
 * @returns true if renamed, else false
 */
const renameEntry = (entry: IEntry, parent: IFolder, newName: string): boolean => {
    try {
        const canRename = canRenameEntry(entry, parent, newName);

        if (canRename) {
            entry.name = newName;
            return true;
        }
        else {
            window.alert(`Duplicate name: ${newName} already exists in ${parent.name}.`);
            return false;
        }
    } catch (e) {
        console.error(e);
        window.alert(`Error renaming ${entry.name} to ${newName}`);
        return false;
    }
}   

const getAllNames = (folder: IFolder) => {
    const names = folder.content.map(entry => entry.name);
    return names;
}

/**
 *  Sorts folder by alphanumerical and folders before files 
 * @param folder 
 * @returns reference to same folder
 */
function sortFolder(folder: IFolder): IFolder {
    folder.content.sort((a, b) => a.name.localeCompare(b.name));
    folder.content.sort((a, b) => {
        if (a.type === EntryType.File && b.type === EntryType.Folder) return 1
        else if (a.type === EntryType.Folder && b.type === EntryType.File) return -1;
        else return 0;
    });
    return folder;
}

export const fs_functions = {
    createRoot: createRoot,
    createFolder: createFolder,
    createFile: createFile,
    moveEntry: moveEntry,
    canAddEntry: canAddEntry,
    canRemoveEntry: canRemoveEntry,
    canMoveEntry: canMoveEntry,
    canRenameEntry: canRenameEntry,
    addEntry: addEntry,
    removeEntry: removeEntry,
    addMetadata: addMetadata,
    removeMetadata: removeMetadata,
    getAllNames: getAllNames,
    renameEntry: renameEntry,
}