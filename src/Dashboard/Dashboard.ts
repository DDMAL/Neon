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
const backButton: HTMLButtonElement = document.querySelector('#fs-back-btn');
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

/**
 * Opens a new tab with the Neon editor for the given filename
 * @param filename key of file in PouchDB or manifest url
 * @param isSample boolean to decide where to fetch file
 */
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
 * Creates a folder or file tile element given an entry
 * @param entry IEntry
 * @returns HTMLDivElement tile element
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

/**
 * Adds dblclick event listener to tile element and adds shift selection behaviour
 * @param index as displayed on dashboard to user
 * @param entry corresponding entry in current folder
 * @param tile HTMLDivElement
 */
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
 * Updates the nav path with current folder path
 */
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

/**
 * Updates the back button with click event listener to go back one folder if possible
 */
function updateBackButton() {
  const isRoot = state.getFolderPath().length === 1;
  if (isRoot) {
    backButton.classList.remove('active');
    backButton.removeEventListener('click', handleNavigateBack);
  }
  else {
    backButton.classList.add('active');
    backButton.addEventListener('click', handleNavigateBack);
  }
}

/**
 * Handles click event on back button to go back one folder if possible
 */
async function handleNavigateBack() {
  const newPath = state.getFolderPath().slice(0, -1);
  await updateDashboard(newPath);
}

/**
 * Prompts user for a new fondler name with in-tile text input.
 */
function handleAddFolder() {
  // abort if parent folder is immutable
  const isImmutable = state.getParentFolder().metadata['immutable'];
  if (isImmutable) {
    const stringPath = state.getFolderPath().map(folder => folder.name).join('/');
    window.alert(`Cannot add Folder. ${stringPath} is immutable.`);
    return;
  }

  // create new folder element
  const newFolderTile = document.createElement('div');
  newFolderTile.classList.add('document-entry');
  newFolderTile.classList.add('folder-entry');
  newFolderTile.setAttribute('id', 'new-folder');

  // add new folder text
  const newFolderText = document.createElement('div');
  newFolderText.classList.add('filename-text');
  newFolderTile.appendChild(newFolderText);

  // push folder to start of dashboard
  documentsContainer.childNodes[0].before(newFolderTile);

  // lets user input new folder name on newly created folder; no file system changes yet
  // on successful text input, add new folder to file system and update dashboard
  // on failure, removes newFolderTile completely
  focusForInput(newFolderTile, '', (newName: string) => {
    const newFolder = fs_functions.createFolder(newName);
    const succeeded = fs_functions.addEntry(newFolder, state.getParentFolder());
    if (succeeded) {
      newFolderTile.setAttribute('id', newName);
      fsm.setFileSystem(state.getFolderPath().at(0));
      updateDashboard(); // todo: replace with sort()
      return true;
    }
    else {
      newFolderTile.remove();
      return false;
    }
  },
  // failure callback: remove newFolderTile completely
  () => {
    newFolderTile.remove();
  });
}

/**
 * Prompts user to rename entry in file system, and if successful: persist in local storage, and updates tile name
 * @param entry IEntry to rename
 */
function rename(entry: IEntry) {
  // abort if parent folder
  const isImmutable = state.getParentFolder().metadata['immutable'];
  if (isImmutable) {
    const stringPath = state.getFolderPath().map(folder => folder.name).join('/');
    window.alert(`Cannot rename ${entry.name}. ${stringPath} is immutable.`);
    return;
  }
  // or entry is immutable
  const immutable = entry.metadata['immutable'];
  if (immutable) {
    window.alert(`Cannot rename ${entry.name}. Entry is immutable.`);
    return;
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
 * @param tile HTMLDivElement
 * @param oldName string
 * @param fs_callback callback function to update file system
 * @param failure_callback cleanup function to run on any failure
 */
function focusForInput(tile: HTMLDivElement, oldName: string, fs_callback: (name: string) => boolean, failure_callback?: () => void) {
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
    if (newName && newName.length > 0) {
      console.log('a');
      // run callback to update file system
      const succeeded = fs_callback(newName);
      // put updated text back into tile
      if (succeeded) {
        text.innerHTML = formatFilename(newName, 25);
      }
      else {
        input.remove();
        tile.appendChild(text);
        if (failure_callback) failure_callback();
      }
    }
    else {
      input.remove();
      tile.appendChild(text);
      if (failure_callback) failure_callback();
    }

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

/**
 * If only one tile is selected, starts renaming process on Enter key press
 * @param e KeyboardEvent
 */
function handleEnterRename(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    const selections = state.getSelectedEntries();
    if (selections.length === 1) {
      rename(selections[0]);
    }
  }
}

/**
 * Given an entry id, returns the entry from the current folder
 * @param id 
 * @returns IEntry
 */
function getEntryById(id: string): IEntry {
  const targetEntry = state.getEntries().find(entry => {
    if (entry.type === 'folder') return entry.name === id;
    else return (entry as IFile).content === id;
  });
  return targetEntry;
}

/**
 * Given an entry, returns the entry id depending on entry type
 * @param entry IEntry
 * @returns id string
 */
function getEntryId(entry: IEntry): string {
  if (entry.type === 'folder') return entry.name;
  else return (entry as IFile).content;
}

/**
 * Reflects changes in file system in dashboard UI
 * @param newPath If provided, uses this path to update dashboard. Otherwise, uses current path.
 */
export async function updateDashboard(newPath?: IFolder[]): Promise<void> {
  if (!newPath) newPath = state.getFolderPath();
  state.setFolderPath(newPath);
  const currentFolder = newPath.at(-1);

  // clear content and selection
  documentsContainer.innerHTML = '';
  shiftSelection.reset();

  // update ordered items for current fs-contents
  state.setEntries(currentFolder.content);

  // populate folder contents
  currentFolder.content.forEach(async (entry, index) => {
    const tile = createTile(entry);
    documentsContainer.appendChild(tile);
    await addTileEventListener(index, entry, tile);
  }); 

  updateNavPath();
  updateBackButton();
  updateActionBarButtons();
  fsm.setFileSystem(state.getFolderPath().at(0));
}

/**
 * Loads root folder into dashboard on startup. 
 */
export const loadDashboard = async (): Promise<void> => {
  const root = await fsm.getRoot();
  updateDashboard([root]);
}