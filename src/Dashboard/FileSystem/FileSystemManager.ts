import { IFolder, fs_functions } from '.';
import { fetchUploadedDocuments } from '../Storage';
import { samples_names } from '../samples';

// Manager is used for accessing local storage and tracking the position of current folder
export const FileSystemManager = () => {

    async function getRoot(): Promise<IFolder> { 
        return await getFileSystem() 
    }

    // Save filesystem into local storage
    function setFileSystem(root: IFolder): boolean {
        try {
            console.log(root);
            window.localStorage.setItem('neon-fs', JSON.stringify(root));
        } catch (e) {
            console.error(e);
            window.alert('Error saving file system');
            return false;
        }
        return true;
    }

    // Load filesystem from local storage, creates new root if none exists
    async function getFileSystem(): Promise<IFolder> {
        try {
            const fs = window.localStorage.getItem('neon-fs');
            
            // if localstorage exists, load previous root
            if (fs) {
                const localFileSystem = JSON.parse(fs) as IFolder;
                return localFileSystem;
            }
            // else, create new root
            else {
                const root = fs_functions.createRoot('Home', []);
                loadSamples(root);
                await loadPreviousUploads(root);
                setFileSystem(root);
                return root;
            }
        } catch (e) {
            console.error(e);
            window.alert('Error loading file system');
        }
    } 

    // This next function is solely for loading samples into the root as a default for Neon
    function loadSamples(root: IFolder) {
        // Make sample entries
        const sampleEntries = samples_names.map(([name, type]) => {
            const entry = fs_functions.createFile(name, name);
            if (type === 'folio') {
                fs_functions.addMetadata(entry, { type: 'folio', document: 'sample', immutable: true });
            }
            else if (type === 'manuscript') {
                fs_functions.addMetadata(entry, { type: 'manuscript', document: 'sample', immutable: true });
            }
            return entry;
        });

        // Make samples folder and add to root
        const samplesFolder = fs_functions.createFolder('Samples');
        fs_functions.addMetadata(samplesFolder, { immutable: true });
        fs_functions.addEntry(samplesFolder, root);

        // Add sample entries to samples folder
        sampleEntries.forEach((sample) => {
            fs_functions.addEntry(sample, samplesFolder);
        });

        return root;
    }

    async function loadPreviousUploads(root: IFolder) {
        // Get previous uploads from local storage
        const uploads = await fetchUploadedDocuments();

        // Make upload entries
        const uploadEntries = uploads.map((upload) => {
            return fs_functions.createFile(upload, upload);
        });

        uploadEntries.forEach((upload) => {
            fs_functions.addEntry(upload, root);
        });

        return root;
    }

    const FileSystemProps = {
        getRoot: getRoot,
        setFileSystem: setFileSystem,
        getFileSystem: getFileSystem,
    }

    return FileSystemProps;
}