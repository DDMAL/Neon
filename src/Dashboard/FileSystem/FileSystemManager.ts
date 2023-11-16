import { IFolder, FileSystemTools } from '.';
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

          const root = FileSystemTools.createFolder('Home');
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
        const root = FileSystemTools.createFolder('Home');
        loadSamples(root);
        newTrash(root);
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
      const entry = FileSystemTools.createFile(name, name);
      if (type === 'folio') {
        FileSystemTools.addMetadata(entry, { type: 'folio', document: 'sample', immutable: true });
      }
      else if (type === 'manuscript') {
        FileSystemTools.addMetadata(entry, { type: 'manuscript', document: 'sample', immutable: true });
      }
      return entry;
    });

    // Make samples folder and add to root
    const samplesFolder = FileSystemTools.createFolder('Samples');
    // Add sample entries to samples folder
    sampleEntries.forEach((sample) => {
      FileSystemTools.addEntry(sample, samplesFolder);
    });
    FileSystemTools.addEntry(samplesFolder, root);
    FileSystemTools.addMetadata(samplesFolder, { immutable: true });

    return root;
  }

  function newTrash(root: IFolder) {
    const trashFolder = FileSystemTools.createTrash('Trash');
    FileSystemTools.addEntry(trashFolder, root);
  }

  async function loadPreviousUploads(root: IFolder) {
    // Get previous uploads from local storage
    const uploads = await fetchUploads();

    // Make upload entries
    const uploadEntries = uploads.map((upload) => {
      return FileSystemTools.createFile(upload.name, upload.id);
    });

    uploadEntries.forEach((upload) => {
      FileSystemTools.addEntry(upload, root);
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