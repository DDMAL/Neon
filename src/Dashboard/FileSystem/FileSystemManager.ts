import { IFolder, FileSystemTools } from '.';
import { fetchUploads } from '../Storage';
import { samples } from '../samples_filenames';

interface FileSystemProps {
  getRoot: () => Promise<IFolder>;
  setFileSystem: (root: IFolder) => boolean;
  getFileSystem: () => Promise<IFolder>;
  newTrash: (root: IFolder) => void;
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
      let root: IFolder;

      // if localstorage exists, load previous root
      if (fs) {
        root = JSON.parse(fs) as IFolder;
      }
      // else, create new root
      else {
        root = FileSystemTools.createFolder('Home');
        newTrash(root);
        await loadPreviousUploads(root);
      }

      // Both paths need the Samples folder checked/populated: a brand new
      // root has none yet, and an existing one may be missing samples added
      // to Neon after it was first created.
      loadSamples(root);
      setFileSystem(root);
      return root;
    } catch (e) {
      console.error(e);
      window.alert('Error loading file system');
    }
  }

  // The Samples folder can't be changed by the user (it's immutable), so its
  // contents only ever change when this code updates them. Nothing else
  // triggers that update, so it has to be checked on every load, not just
  // the first time the folder is created — which matters whenever a
  // developer adds a new sample to samples_filenames.ts after users already
  // have a Samples folder saved. 
  // 
  // Ideally this would check a version number instead of diffing the full list 
  // on every load; skipped for now since the list is only a handful of entries, 
  // so the diff cost is negligible.
  //
  // This one function does two separate jobs that don't depend on each other: 
  // (1) find-or-create the Samples folder itself, a one-time setup concern, and 
  // (2) diff+fill in whatever samples it's missing, a every-load sync concern. 
  // They're interleaved below instead of being two functions because this fix was 
  // kept to editing in place rather than restructuring the file; splitting them 
  // into e.g. ensureSamplesFolder() and syncSamples() would read more clearly if 
  // this gets touched again.
  function loadSamples(root: IFolder) {
    // --- job 1: find-or-create the folder itself (one-time setup) ---
    const existingSamplesFolder = root.children.find(
      (entry) => entry.type === 'folder' && entry.name === 'Samples',
    ) as IFolder;
    const samplesFolder =
      existingSamplesFolder ?? FileSystemTools.createFolder('Samples');

    // --- job 2: diff+fill in missing samples (runs every load) ---
    // Names already in samplesFolder are left untouched; only the ones from
    // `samples` that aren't in there yet get built into new entries below.
    const existingNames = FileSystemTools.getAllNames(samplesFolder);
    const missingSamples = samples.filter(
      ([name]) => !existingNames.includes(name),
    );

    // Make entries for the missing samples
    const sampleEntries = missingSamples.map(([name, type]) => {
      const entry = FileSystemTools.createFile(name, name);
      if (type === 'folio') {
        FileSystemTools.addMetadata(entry, {
          type: 'folio',
          document: 'sample',
          immutable: true,
        });
      } else if (type === 'manuscript') {
        FileSystemTools.addMetadata(entry, {
          type: 'manuscript',
          document: 'sample',
          immutable: true,
        });
      }
      return entry;
    });

    // Add entries directly, bypassing addEntry: the Samples folder is immutable
    // once created, so addEntry would reject writes into it.
    sampleEntries.forEach((sample) => samplesFolder.children.push(sample));
    if (sampleEntries.length > 0) FileSystemTools.sortFolder(samplesFolder);

    // --- back to job 1: attach + lock, but only the first time ever ---
    // An existing folder was already attached and locked by a previous
    // call, so skip redoing it here.
    if (!existingSamplesFolder) {
      FileSystemTools.addEntry(samplesFolder, root);
      FileSystemTools.addMetadata(samplesFolder, { immutable: true });
    }

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
    newTrash: newTrash,
  };

  return FileSystemProps;
};
