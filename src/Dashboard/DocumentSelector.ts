import { IEntry, IFile, IFolder, fs_functions } from './FileSystem';
import { deleteEntry } from './Storage';
import { formatFilename } from './upload_functions';
import { FileSystemManager } from './FileSystem';
import ShiftSelectionManager from './ShiftSelectionManager';
import { InitUploadArea } from './UploadArea';

const documentsContainer: HTMLDivElement = document.querySelector('#fs-content-container');
const backgroundArea: HTMLDivElement = document.querySelector('#main-section-content');
const openButton: HTMLButtonElement = document.querySelector('#open-doc');
const deleteButton: HTMLButtonElement = document.querySelector('#remove-doc');

// const navBackButton: HTMLButtonElement = document.querySelector('#fs-back-btn');
const navPathContainer: HTMLDivElement = document.querySelector('#nav-path-container');

const uploadDocumentsButton: HTMLButtonElement = document.querySelector('#upload-new-doc-button');
const newFolderButton: HTMLButtonElement = document.querySelector('#add-folder-button');

const shiftSelection = new ShiftSelectionManager();
const fsm = FileSystemManager();

let currentPath: IFolder[]; // to get current Folder: currentPath.at(-1)

// Lists the documents in order as represented on dashboard
let orderedEntries: IEntry[];
let orderedSelection: boolean[];

let metaKeyIsPressed = false;
let shiftKeyIsPressed = false;

// navBackButton!.addEventListener('click', handleNavigateBack);
openButton!.addEventListener('click', handleOpenDocuments);
deleteButton!.addEventListener('click', handleDeleteDocuments);
uploadDocumentsButton!.addEventListener('click', handleUploadDocuments);
newFolderButton!.addEventListener('click', handleCreateFolder)

function handleUploadDocuments() {
  const isImmutable = currentPath.at(-1).metadata['immutable'];
  if (isImmutable) {
    const stringPath = currentPath.map(folder => folder.name).join('/');
    window.alert(`Cannot upload documents. ${stringPath} is immutable.`);
    return false;
  }
  InitUploadArea(currentPath.at(-1));
}


window.addEventListener('keydown', (e) => {
  if (e.metaKey) metaKeyIsPressed = true;
  if (e.shiftKey) shiftKeyIsPressed = true;
  // Lose focus on esc key
  if (e.key === 'Escape') {
    unselectAll();
    shiftSelection.reset();
    updateActionBarButtons();
  }
});

window.addEventListener('keyup', (e) => {
  if (!e.metaKey) metaKeyIsPressed = false;
  if (!e.shiftKey) shiftKeyIsPressed = false;
});

window.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const selections = getSelectionEntries();
    if (selections.length === 1) {
      const selected = selections[0];
      handleRenaming(selected);
    }
  }
});

backgroundArea!.addEventListener('click', (e) => {
  const target = e.target as Element;
  // Lose focus if click event in main section is not a document tile
  const isDocument = Boolean(target.closest('.document-entry'))
  if (!isDocument) {
    unselectAll();
    shiftSelection.reset();
    updateActionBarButtons();
  }
});

// gets user selected filenames
function getSelectionEntries() {
  return orderedEntries.filter((_, idx) => orderedSelection[idx]);
}

// Open editor tab
function openEditorTab(filename: string, isSample: boolean) {
  const params = (isSample)
    ? { manifest: filename }
    : { storage: filename };
  const query = makeQuery(params);
  window.open(`./editor.html?${query}`, '_blank');
}

// Opens editor tab given a document tile element
function openFile(entry: IFile) {
  console.log(entry);
  const documentType = entry.metadata['document'];
  if (typeof documentType !== undefined) {
    const isSample = documentType === 'sample';
    openEditorTab(entry.content, isSample);
  }
}

function makeQuery(obj): string {
  return Object.keys(obj).map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
  }).join('&');
}

function unselect(idx: number, tile?: Element) {
  if (!tile) {
    const tileId = orderedEntries[idx].name;
    tile = document.getElementById(tileId);
  }
  tile.classList.remove('selected');
  orderedSelection[idx] = false;
}

function unselectAll() {
  Array.from(document.querySelectorAll('.document-entry.selected'))
    .forEach((folio) => folio.classList.remove('selected'));
  orderedSelection.fill(false);
}

function select(idx: number, tile?: Element) {
  if (!tile) {
    const tileId = orderedEntries[idx].name;
    tile = document.getElementById(tileId);
  }
  tile.classList.add('selected');
  orderedSelection[idx] = true;
}

// Determines whether to set action bar
function updateActionBarButtons() {
  // set active if there is a selection
  const nothingSelected = orderedSelection.every((selected) => !selected)
  if (nothingSelected) {
    openButton.classList.remove('active');
    deleteButton.classList.remove('active');
  }
  else {
    openButton.classList.add('active');
    deleteButton.classList.add('active');
  }

  // update upload doc/add folder to active if parent folder isn't immutable
  const isImmutable = currentPath.at(-1).metadata['immutable'];
  if (isImmutable) {
    uploadDocumentsButton.classList.remove('active');
    newFolderButton.classList.remove('active');
    deleteButton.classList.remove('active');
  }
  else {
    uploadDocumentsButton.classList.add('active');
    newFolderButton.classList.add('active');
  }
}

// Creates a folder, folio, or manuscript tile element
function createTile(entry: IEntry) {
  const doc = document.createElement('div');
  doc.classList.add('document-entry');
  switch (entry.type) {
    case 'folder':
      doc.classList.add('folder-entry');
      doc.setAttribute('id', entry.name);
      break;
    case 'file':
      doc.classList.add('file-entry');
      doc.setAttribute('id', (entry as IFile).content);
      break;
  }

  const name = document.createElement('div');
  name.classList.add('filename-text');
  name.innerHTML = formatFilename(entry.name, 25);
  doc.appendChild(name);
  return doc;
}

async function addTileEventListener(index: number, entry: IEntry, tile: HTMLDivElement) {
  // double click event immediately opens document
  if (entry.type === 'folder') {
    async function enterFolder() {
      return await updateDocumentSelector([...currentPath, entry as IFolder]);
    }
    tile.addEventListener('dblclick', enterFolder, false);
  }
  else {
    tile.addEventListener('dblclick', handleOpenDocuments, false);
  }
  addShiftSelectionListener(tile, index);
}

/**
 * Add shift selection behaviour to html tile element
 * 
 * When no keys are pressed: erase any previous selections and select only current tile
 * When meta key is pressed: add current tile to selection if not already selected, else remove from selection
 * When shift key is pressed: select all tiles between current tile and previous tile
 * 
 * When there is a previous selection, the start of the shift selection is the last selected tile. Shift clicking after will add the shift selection to the previous selection.
 */
function addShiftSelectionListener(tile: HTMLDivElement, index: number) {
  tile.addEventListener('click', function(e) {
    if (!metaKeyIsPressed && !shiftKeyIsPressed) {
      unselectAll();
      select(index, tile);
      shiftSelection.setStart(index); 
    }
    else if (metaKeyIsPressed) {
      if (orderedSelection[index]) {
        unselect(index, tile);
        shiftSelection.setStart(orderedSelection.lastIndexOf(true));
      }
      else {
        select(index, tile);
        shiftSelection.setStart(index); 
      }
    }
    else if (shiftKeyIsPressed) {
      shiftSelection.getPrevSelection().forEach((idx) => {
        unselect(idx);
      });
      shiftSelection.setEnd(index);
      shiftSelection.getSelection(orderedSelection).forEach((idx) => {
        select(idx);
      });
    }
    updateActionBarButtons();
  }, false);
}

function handleOpenDocuments() {
  getSelectionEntries().forEach((entry: IEntry) => {
    // Open document if it is a file and not a folder
    if (entry.type === 'file') openFile(entry as IFile);
  });
  shiftSelection.reset();
  unselectAll();
  updateActionBarButtons();
}

function handleDeleteDocuments() {
  function deleteFileEntry(file: IFile): Promise<boolean> {
    return new Promise((resolve, reject) => {
      deleteEntry(file.content)
        .then(() => {
          fs_functions.removeEntry(file, currentPath.at(-1));
          resolve(true);
        })
        .catch(() => reject(false));
    });
  }

  function deleteFolderEntry(folder: IFolder): Promise<boolean> {
    // only delete a folder if it is empty
    const isEmpty = folder.content.length === 0;

    return new Promise((resolve) => {
      if (isEmpty) {
        fs_functions.removeEntry(folder, currentPath.at(-1));
        resolve(true);
      }
      else {
        window.alert(`Cannot delete ${folder.name}. Folder is not empty.`);
        resolve(false);
      }
    });
  }

  const allEntries = getSelectionEntries();
  const deletableEntries = allEntries.filter(entry => entry.metadata['immutable'] !== true);
  const immutableEntries = allEntries.filter(entry => entry.metadata['immutable'] === true);

  // Create a formatted list of filenames to display in alert message
  const createList = (entryArray: IEntry[]) => entryArray.map(entry => `- ${entry.name} (${entry.type})`).join('\n');

  let alertMessage = '';
  
  if (immutableEntries.length > 0) {
    const immutableMessage = `The following files cannot be deleted:\n${createList(immutableEntries)}\n`;
    alertMessage = immutableMessage + alertMessage;
  }

  alertMessage += `Are you sure you want to delete:\n${createList(deletableEntries)}\nThis action is irreversible.`;

  const isConfirmed = window.confirm(alertMessage);

  if (isConfirmed) {
    const deletePromises = deletableEntries.map(entry => {
      if (entry.type === 'file') {
        return deleteFileEntry(entry as IFile);
      }
      else if (entry.type === 'folder') {
        return deleteFolderEntry(entry as IFolder);
      }
    });

    Promise.all(deletePromises)
      .then(() => {
        updateDocumentSelector(currentPath);
      })
      .catch( err => console.debug('failed to delete files: ', err));
  }
}

// reloads document selector with previous folder
function handleNavigateBack() {
  const newPath = currentPath.slice(0, -1);
  updateDocumentSelector(newPath);
}

// updates nav path display, returns nothing
function updateNavPath(currentPath: IFolder[]): void {
  navPathContainer.innerHTML = '';

  function handleNavClick(targetPath: IFolder[]): () => void {
    return async () => await updateDocumentSelector(targetPath);
  }

  // create nav elements and add event listeners
  const navElements = currentPath.map((folder, idx) => {
    const navSection = document.createElement('div');
    navSection.classList.add('nav-path-section');
    navSection.innerHTML = folder.name;

    const targetPath = currentPath.slice(0, idx + 1);
    navSection.addEventListener('click', handleNavClick(targetPath));
    return navSection
  });

  // add nav elements to nav path container
  navElements.forEach((navElement, idx) => {
    navPathContainer.appendChild(navElement);
    if (idx !== navElements.length - 1) {
      const seperator = document.createElement('div');
      seperator.classList.add('nav-path-seperator');
      seperator.innerHTML = ' / ';
      navPathContainer.appendChild(seperator);
    }
  });
}

function handleCreateFolder() {
  // abort if parent folder
  const isImmutable = currentPath.at(-1).metadata['immutable'];
  if (isImmutable) {
    const stringPath = currentPath.map(folder => folder.name).join('/');
    window.alert(`Cannot add Folder. ${stringPath} is immutable.`);
    return false;
  }

  const folder = fs_functions.createFolder('new file');
  fs_functions.addEntry(folder, currentPath.at(-1));
  updateDocumentSelector();
}

// opens prompt to rename entry in file system, persist in local storage, and updates tile name
function handleRenaming(entry: IEntry): boolean {
  // abort if parent folder
  const isImmutable = currentPath.at(-1).metadata['immutable'];
  if (isImmutable) {
    const stringPath = currentPath.map(folder => folder.name).join('/');
    window.alert(`Cannot rename ${entry.name}. ${stringPath} is immutable.`);
    return false;
  }
  // or entry is immutable
  const immutable = entry.metadata['immutable'];
  if (immutable) {
    window.alert(`Cannot rename ${entry.name}. Entry is immutable.`);
    return false;
  }
  
  const oldName = entry.name;
  const newName = promptNewName();
  if (newName) {
    const succeeded = fs_functions.renameEntry(entry, currentPath.at(-1), newName);
    if (succeeded) {
      fsm.setFileSystem(currentPath.at(0));
      updateTileName(entry, oldName, newName);
      return true;
    }
  }
  return false;
}

function promptNewName() {
  const newName = window.prompt('Enter new name:');
  return newName;
}

// updates text and if applicable, id of tile element
function updateTileName(entry: IEntry, oldName: string, newName: string) {
  const isFolder = (entry.type === 'folder');
  // get tile element
  const id: string = isFolder ? oldName : (entry as IFile).content;
  const tile = document.getElementById(id);
  if (isFolder) tile.setAttribute('id', newName);
  tile.querySelector('.filename-text').innerHTML = formatFilename(newName, 25);
}

export async function updateDocumentSelector(newPath?: IFolder[]): Promise<void> {
  if (!newPath) newPath = currentPath;
  currentPath = newPath;
  const currentFolder = newPath.at(-1);

  // clear content and selection
  documentsContainer.innerHTML = '';
  shiftSelection.reset();

  // update ordered items for current fs-contents
  orderedEntries = currentFolder.content;
  orderedSelection = new Array<boolean>(orderedEntries.length).fill(false);
  shiftSelection.reset();

  // populate folder contents
  currentFolder.content.forEach(async (entry, index) => {
    const tile = createTile(entry);
    documentsContainer.appendChild(tile);
    await addTileEventListener(index, entry, tile);
  }); 

  // update path display
  updateNavPath(currentPath);

  // update action bar 
  updateActionBarButtons();

  // // update back button if at root
  // if (newPath.length === 1) {
  //   navBackButton.classList.remove('active');
  //   navBackButton.disabled = true;
  // }
  // else {
  //   navBackButton.classList.add('active');
  //   navBackButton.disabled = false;
  // }

  fsm.setFileSystem(currentPath.at(0));
}

export const InitDocumentSelector = async (): Promise<void> => {
  const root = await fsm.getRoot();
  updateDocumentSelector([root]);
}