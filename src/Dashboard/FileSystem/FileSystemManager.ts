import { IFolder, fs_functions } from '.';
import { fetchUploads, db } from '../Storage';
import { samples } from '../samples_filenames';

interface FileSystemProps {
  getRoot: () => Promise<IFolder>;
  setFileSystem: (root: IFolder) => boolean;
  getFileSystem: () => Promise<IFolder>;
}
  

// Manager is used for accessing local storage and tracking the position of current folder
export const FileSystemManager = (): FileSystemProps => {

  async function getRoot(): Promise<IFolder> { 
    return await getFileSystem();
  }

  // Save filesystem into local storage
  function setFileSystem(root: IFolder): boolean {
    try {
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

        // if old file system, clean local storage & db
        if (!localFileSystem.children) {
          window.localStorage.clear();

          const result = await db.allDocs({ include_docs: true });
          // Delete each document
          const docsToDelete = result.rows.map((row) => ({
            _id: row.id,
            _rev: row.doc._rev,
            _deleted: true,
          }));
          await db.bulkDocs(docsToDelete);

          const root = fs_functions.createFolder('Home');
          loadSamples(root);
          setFileSystem(root);
          return root;
        }
        else {
          return localFileSystem;
        }

      }
      // else, create new root
      else {
        const root = fs_functions.createFolder('Home');
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
    const sampleEntries = samples.map(([name, type]) => {
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
    // Add sample entries to samples folder
    sampleEntries.forEach((sample) => {
      fs_functions.addEntry(sample, samplesFolder);
    });
    fs_functions.addEntry(samplesFolder, root);
    fs_functions.addMetadata(samplesFolder, { immutable: true });

    return root;
  }

  async function loadPreviousUploads(root: IFolder) {
    // Get previous uploads from local storage
    const uploads = await fetchUploads();

    // Make upload entries
    const uploadEntries = uploads.map((upload) => {
      return fs_functions.createFile(upload.name, upload.id);
    });

    uploadEntries.forEach((upload) => {
      fs_functions.addEntry(upload, root);
    });

    return root;
  }

  const FileSystemProps: FileSystemProps = {
    getRoot: getRoot,
    setFileSystem: setFileSystem,
    getFileSystem: getFileSystem,
  };

  return FileSystemProps;
};