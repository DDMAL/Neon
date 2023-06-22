import { IFolder, IEntry, fs_functions } from '.';
import { fetchUploadedDocuments } from '../Storage';
import { samples_names } from '../samples';

const FileSystemManager = () => {
    // Save filesystem into local storage
    function setFileSystem(fs: IFolder): boolean {
        try {
            const save_fs = fs_functions.createRoot(fs.name, fs.content);
            window.localStorage.setItem('neon-fs', JSON.stringify(save_fs));
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
            const localFileSystem = JSON.parse(fs) as IFolder;

            // If no file system exists, create a new one
            if (localFileSystem === null) {
                const newRoot = fs_functions.createRoot('root', []);
                const rootSamples = loadSamples(newRoot);
                const rootSamplesUploads = await loadPreviousUploads(rootSamples);
                setFileSystem(rootSamplesUploads);
                return rootSamplesUploads;
            }

            // If file system exists, return it
            return localFileSystem;

        } catch (e) {
            console.error(e);
            window.alert('Error loading file system');
        }
    } 

    // This next function is solely for loading samples into the root as a default for Neon
    function loadSamples(root: IFolder) {
        // Make sample entries
        const sampleEntries = samples_names.map(([name, type]) => {
            if (type === 'folio') {
                return fs_functions.createFolio(name, name);
            }
            else if (type === 'manuscript') {
                return fs_functions.createManuscript(name, name);
            }
        });
        // Make samples folder and add to root
        const samplesFolder = fs_functions.createFolder('Samples');
        fs_functions.AddEntry(samplesFolder, root);
        // Add sample entries to samples folder
        sampleEntries.forEach((sample) => {
            fs_functions.AddEntry(sample, samplesFolder);
        });

        return root;
    }

    async function loadPreviousUploads(root: IFolder) {
        // Get previous uploads from local storage
        const uploads = await fetchUploadedDocuments();

        // Make upload entries
        const uploadEntries = uploads.map((upload) => {
            return fs_functions.createFolio(upload, upload);
        });

        uploadEntries.forEach((upload) => {
            fs_functions.AddEntry(upload, root);
        });

        return root;
    }

    const root = getFileSystem();

    const FileSystemProps = {
        root: root,
        setFileSystem: setFileSystem,
        getFileSystem: getFileSystem,
    }

    return FileSystemProps;
}
    
export default FileSystemManager;