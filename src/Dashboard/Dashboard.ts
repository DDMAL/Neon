import { IEntry, IFile, IFolder, fs_functions } from './FileSystem';
import { deleteEntry } from './Storage';
import { formatFilename } from './upload_functions';
import { FileSystemManager } from './FileSystem';
import { ShiftSelectionManager, dashboardState } from './dashboard_functions';
import { InitUploadArea } from './UploadArea';

const documentsContainer: HTMLDivElement = document.querySelector('#fs-content-container');
const backgroundArea: HTMLDivElement = document.querySelector('#main-section-content');
const openButton: HTMLButtonElement = document.querySelector('#open-doc');
const deleteButton: HTMLButtonElement = document.querySelector('#remove-doc');
const navPathContainer: HTMLDivElement = document.querySelector('#nav-path-container');
const uploadDocumentsButton: HTMLButtonElement = document.querySelector('#upload-new-doc-button');
const newFolderButton: HTMLButtonElement = document.querySelector('#add-folder-button');

const shiftSelection = new ShiftSelectionManager();
const fsm = FileSystemManager();
const state = dashboardState();

let metaKeyIsPressed = false;
let shiftKeyIsPressed = false;

openButton!.addEventListener('click', handleOpenDocuments);
deleteButton!.addEventListener('click', handleDeleteDocuments);
uploadDocumentsButton!.addEventListener('click', handleOpenUploadArea);
newFolderButton!.addEventListener('click', handleAddFolder)

// Sorting algorithms
const sortByAlphanumerical = (a: IEntry, b: IEntry) => a.name.localeCompare(b.name);
const sortByTime = (a: IEntry, b: IEntry) => {
  const aTime = a.metadata['created_on'];
  const bTime = b.metadata['created_on'];
  if (aTime && bTime) return aTime - bTime;
  else if (aTime) return -1;
}

function handleOpenUploadArea() {
  const isImmutable = state.getParentFolder().metadata['immutable'];
  if (isImmutable) {
    const stringPath = state.getFolderPath().map(folder => folder.name).join('/');
    window.alert(`Cannot upload documents. ${stringPath} is immutable.`);
    return false;
  }
  InitUploadArea(state.getParentFolder());
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

// Listener for Enter key press on tiles to rename
window.addEventListener('keypress', handleEnterRename, false);

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

function select(index: number) {
  const entry = state.getEntries().at(index)
  const id = getEntryId(entry);
  state.setSelection(index, true);
  const tile = document.getElementById(id);
  tile.classList.add('selected');
}

function unselect(index: number) {
  const id = state.getEntries().at(index).name;
  state.setSelection(index, false);
  const tile = document.getElementById(id);
  tile.classList.remove('selected');
}

function unselectAll() {
  Array.from(document.querySelectorAll('.document-entry.selected'))
    .forEach((tile) => tile.classList.remove('selected'));
  state.resetSelection();
}

/**
 * Updates the visibility of action bar buttons based on current selections
 */
function updateActionBarButtons() {
  // set active if there is a selection
  const nothingSelected = state.getSelection().every((selected) => !selected)
  if (nothingSelected) {
    openButton.classList.remove('active');
    deleteButton.classList.remove('active');
  }
  else {
    openButton.classList.add('active');
    deleteButton.classList.add('active');
  }

  // update upload doc/add folder to active if parent folder isn't immutable
  const isImmutable = state.getParentFolder().metadata['immutable'];
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

/** 
 * Creates a folder or file tile element given an entry
 */
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
      return await updateDashboard([...state.getFolderPath(), entry as IFolder]);
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
      select(index);
      shiftSelection.setStart(index); 
    }
    else if (metaKeyIsPressed) {
      if (state.getSelection()[index]) {
        unselect(index);
        shiftSelection.setStart(state.getSelection().lastIndexOf(true));
      }
      else {
        select(index);
        shiftSelection.setStart(index); 
      }
    }
    else if (shiftKeyIsPressed) {
      shiftSelection.getPrevSelection().forEach((idx) => {
        unselect(idx);
      });
      shiftSelection.setEnd(index);
      shiftSelection.getSelection(state.getSelection()).forEach((idx) => {
        select(idx);
      });
    }
    updateActionBarButtons();
  }, false);
}

/**
 * Opens current selection of documents on dashboard.
 * 
 * If a folder is selected, opens folder.
 * If a file(s) is selected, opens file(s).
 * If a folder and file(s) are selected, opens file(s).
 */
function handleOpenDocuments() {
  state.getSelectedEntries().forEach((entry: IEntry) => {
    // Open document if it is a file and not a folder
    if (entry.type === 'file') openFile(entry as IFile);
  });
  shiftSelection.reset();
  unselectAll();
  updateActionBarButtons();
}

/**
 * Deletes current selection of documents on dashboard. 
 * 
 * If a folder is selected, deletes folder.
 * If a file(s) is selected, deletes file(s).
 * If a folder and file(s) are selected, deletes all.
 */
function handleDeleteDocuments() {
  function deleteFileEntry(file: IFile): Promise<boolean> {
    return new Promise((resolve, reject) => {
      deleteEntry(file.content)
        .then(() => {
          fs_functions.removeEntry(file, state.getParentFolder());
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
        fs_functions.removeEntry(folder, state.getParentFolder());
        resolve(true);
      }
      else {
        window.alert(`Cannot delete ${folder.name}. Folder is not empty.`);
        resolve(false);
      }
    });
  }

  const allEntries = state.getSelectedEntries();
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
        updateDashboard(state.getFolderPath());
      })
      .catch( err => console.debug('failed to delete files: ', err));
  }
}

// updates nav path display, returns nothing
function updateNavPath(): void {
  navPathContainer.innerHTML = '';

  function handleNavClick(targetPath: IFolder[]): () => void {
    return async () => await updateDashboard(targetPath);
  }

  // create nav elements and add event listeners
  const navElements = state.getFolderPath().map((folder, idx) => {
    const navSection = document.createElement('div');
    navSection.classList.add('nav-path-section');
    navSection.innerHTML = folder.name;

    const targetPath = state.getFolderPath().slice(0, idx + 1);
    navSection.addEventListener('click', handleNavClick(targetPath));
    return navSection
  });

  // add nav elements to nav path container
  navElements.forEach((navElement, idx) => {
    navPathContainer.appendChild(navElement);
    if (idx !== navElements.length - 1) {
      const seperator = document.createElement('div');
      seperator.classList.add('nav-path-seperator');
      seperator.innerHTML = ' > ';
      navPathContainer.appendChild(seperator);
    }
  });
}

function handleAddFolder() {
  // abort if parent folder is immutable
  const isImmutable = state.getParentFolder().metadata['immutable'];
  if (isImmutable) {
    const stringPath = state.getFolderPath().map(folder => folder.name).join('/');
    window.alert(`Cannot add Folder. ${stringPath} is immutable.`);
    return false;
  }

  // push new folder tile onto dashboard
  const newFolderTile = document.createElement('div');
  newFolderTile.classList.add('document-entry');
  newFolderTile.classList.add('folder-entry');
  const newFolderText = document.createElement('div');
  newFolderText.classList.add('filename-text');
  newFolderText.innerHTML = '';
  newFolderTile.appendChild(newFolderText);
  documentsContainer.childNodes[0].before(newFolderTile);

  focusForInput(newFolderTile, '', (newName: string) => {
    const newFolder = fs_functions.createFolder(newName);
    const succeeded = fs_functions.addEntry(newFolder, state.getParentFolder());
    if (succeeded) {
      fsm.setFileSystem(state.getFolderPath().at(0));
      updateDashboard(); // todo: replace with sort()
      return true;
    }
    return false;
  });
}

/**
 * opens prompt to rename entry in file system, persist in local storage, and updates tile name
 * @param entry IEntry to rename
 */
function rename(entry: IEntry) {
  // abort if parent folder
  const isImmutable = state.getParentFolder().metadata['immutable'];
  if (isImmutable) {
    const stringPath = state.getFolderPath().map(folder => folder.name).join('/');
    window.alert(`Cannot rename ${entry.name}. ${stringPath} is immutable.`);
    return false;
  }
  // or entry is immutable
  const immutable = entry.metadata['immutable'];
  if (immutable) {
    window.alert(`Cannot rename ${entry.name}. Entry is immutable.`);
    return false;
  }
  
  const id = getEntryId(entry);
  const tile = document.getElementById(id) as HTMLDivElement;
  focusForInput(tile, entry.name, (newName: string) => {
    const succeeded = fs_functions.renameEntry(entry, state.getParentFolder(), newName);
    if (succeeded) {
      fsm.setFileSystem(state.getFolderPath().at(0));
      updateDashboard(); // todo: replace with sort()
      return true;
    }
    return false;
  });
}

/**
 * Allow user to rename tile by focusing on dynamically generated input element in the selected tile.
 * @param tile HTMLDivElement to change
 * @param oldName string of old name
 * @param callback function to run after user submits new name; to reflect changes file system
 */
function focusForInput(tile: HTMLDivElement, oldName: string, callback: (name: string) => boolean) {
  window.removeEventListener('keypress', handleEnterRename, false); // temporarily remove Enter key press listener for renaming
  tile.innerHTML = ''; // clear tile contents

  // create new text element
  const text = document.createElement('div');
  text.classList.add('filename-text');
  text.innerHTML = formatFilename(oldName, 25);

  // create input element
  const input = document.createElement('input');
  input.classList.add('filename-input');
  input.setAttribute('type', 'text');
  input.setAttribute('value', oldName);
  tile.appendChild(input);

  function handleSubmit() {
    // remove event listeners
    input.removeEventListener('blur', handleSubmit);
    window.removeEventListener('keypress', handleKeyPress);

    const newName = input.value;

    // rename tile
    if (newName) {
      // run callback to update file system
      const succeeded = callback(newName);
      // put updated text back into tile
      if (succeeded) {
        text.innerHTML = formatFilename(newName, 25);
      }
    }
    input.remove();
    tile.appendChild(text);
    // re-add Enter key press listener for renaming
    window.addEventListener('keypress', handleEnterRename, false);
  }

  function handleKeyPress(e: KeyboardEvent) { 
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  input.focus();
  input.select();

  input.addEventListener('blur', handleSubmit);
  window.addEventListener('keypress', handleKeyPress);
}

function handleEnterRename(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    const selections = state.getSelectedEntries();
    if (selections.length === 1) {
      rename(selections[0]);
    }
  }
}

function getEntryById(id: string): IEntry {
  const targetEntry = state.getEntries().find(entry => {
    if (entry.type === 'folder') return entry.name === id;
    else return (entry as IFile).content === id;
  });
  return targetEntry;
}

function getEntryId(entry: IEntry): string {
  if (entry.type === 'folder') return entry.name;
  else return (entry as IFile).content;
}

export async function updateDashboard(newPath?: IFolder[]): Promise<void> {
  if (!newPath) newPath = state.getFolderPath();
  state.setFolderPath(newPath);
  const currentFolder = newPath.at(-1);

  // clear content and selection
  documentsContainer.innerHTML = '';
  shiftSelection.reset();

  // update ordered items for current fs-contents
  state.setEntries(currentFolder.content);
  shiftSelection.reset();

  // populate folder contents
  currentFolder.content.forEach(async (entry, index) => {
    const tile = createTile(entry);
    documentsContainer.appendChild(tile);
    await addTileEventListener(index, entry, tile);
  }); 

  updateNavPath();
  updateActionBarButtons();
  fsm.setFileSystem(state.getFolderPath().at(0));
}

export const loadDashboard = async (): Promise<void> => {
  const root = await fsm.getRoot();
  updateDashboard([root]);
}