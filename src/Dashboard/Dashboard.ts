import { IEntry, IFile, IFolder, fs_functions } from './FileSystem';
import { deleteEntry } from './Storage';
import { formatFilename } from './upload_functions';
import { FileSystemManager } from './FileSystem';
import { ShiftSelectionManager, dashboardState } from './dashboard_functions';
import { InitUploadArea } from './UploadArea';
import * as contextMenuContent from './ContextMenuContent';

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

const mainSection: HTMLElement = document.querySelector('.main-section-content');
const contextMenu: HTMLElement = document.querySelector('.right-click-file-menu');
const contextMenuContentWrapper: HTMLElement = document.querySelector('.context-menu-items-wrapper');

let metaKeyIsPressed = false;
let shiftKeyIsPressed = false;
let currentDragTarget = null;
const currentFileSelection = []; // currently user-selected files
const currentFolderSelection = []; // currently user-selected folders

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
 * 
 * @returns 
 */
function handleOpenUploadArea() {
  const isImmutable = state.getParentFolder().metadata['immutable'];
  if (isImmutable) {
    const stringPath = state.getFolderPath().map(folder => folder.name).join('/');
    window.alert(`Cannot upload documents. ${stringPath} is immutable.`);
    return false;
  }
  InitUploadArea(state.getParentFolder());
}


/**
 * Opens a new tab with the Neon editor for the given filename
 * 
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


/**
 * Opens editor tab given a document tile element
 * 
 * @param entry 
 */
function openFile(entry: IFile) {
  const documentType = entry.metadata['document'];
  if (typeof documentType !== undefined) {
    const isSample = documentType === 'sample';
    openEditorTab(entry.content, isSample);
  }
}


/**
 * 
 * @param obj 
 * @returns 
 */
function makeQuery(obj): string {
  return Object.keys(obj).map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
  }).join('&');
}


/**
 * 
 * @param index 
 */
function select(index: number) {
  const entry = state.getEntries().at(index)
  const id = getEntryId(entry);
  state.setSelection(index, true);
  const tile = document.getElementById(id);
  tile.classList.add('selected');
}


/**
 * 
 * @param index 
 */
function unselect(index: number) {
  const id = state.getEntries().at(index).name;
  state.setSelection(index, false);
  const tile = document.getElementById(id);
  tile.classList.remove('selected');
}


/**
 * 
 */
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
  doc.setAttribute('draggable', 'true'); // make file or folder draggable

  const name = document.createElement('div');
  name.classList.add('filename-text');
  name.innerHTML = formatFilename(entry.name, 25);

  switch (entry.type) {
    case 'folder':
      doc.classList.add('folder-entry');
      doc.setAttribute('id', entry.name);
      doc.setAttribute('drop-id', entry.name);
      doc.classList.add('drop-target');
      name.classList.add('drop-target');
      break;
    case 'file':
      doc.classList.add('file-entry');
      doc.setAttribute('id', (entry as IFile).content);
      break;
  }
  doc.appendChild(name);
  return doc;
}

/**
 * Adds dblclick event listener to tile element and adds shift selection behaviour
 * 
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
  addSpecificContextMenuListeners();
}

/**
 * Add shift selection behaviour to html tile element
 * 
 * When no keys are pressed: erase any previous selections and select only current tile
 * When meta key is pressed: add current tile to selection if not already selected, else remove from
 * selection. When shift key is pressed: select all tiles between current tile and previous tile
 * 
 * When there is a previous selection, the start of the shift selection is the last selected tile. 
 * Shift clicking after will add the shift selection to the previous selection.
 * 
 * @param tile 
 * @param index 
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

  /**
   * function within a function
   * 
   * @param folder 
   * @returns 
   */
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

  /**
   * function within a function
   * 
   * @param targetPath 
   * @returns 
   */
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
      seperator.innerHTML = ' / ';
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
 * 
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
 * 
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
 * 
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
 * updates text and if applicable, id of tile element
 * 
 * @param entry 
 * @param oldName 
 * @param newName 
 */
function updateTileName(entry: IEntry, oldName: string, newName: string) {
  const isFolder = (entry.type === 'folder');
  // get tile element
  const id: string = isFolder ? oldName : (entry as IFile).content;
  const tile = document.getElementById(id);
  if (isFolder) tile.setAttribute('id', newName);
  tile.querySelector('.filename-text').innerHTML = formatFilename(newName, 25);
}



/**
 * Given an entry id, returns the entry from the current folder
 * 
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
 * 
 * @param entry IEntry
 * @returns id string
 */
function getEntryId(entry: IEntry): string {
  if (entry.type === 'folder') return entry.name;
  else return (entry as IFile).content;
}

/**
 * Reflects changes in file system in dashboard UI
 * 
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

  addSpecificContextMenuListeners();

  addSpecificContextMenuListeners();


  // Add dragstart events for every item in the current folder.
  // Set the current drag target (element that is being dragged)
  Array.from(document.querySelectorAll('.document-entry')).forEach((elem) => {
    elem.addEventListener('dragstart', (e) => {
      (<DragEvent> e).dataTransfer.effectAllowed = 'move';
      currentDragTarget = e.target;
    });
  }); 

  // Add dragenter, dragover, and drop events for every folder in the current folder
  Array.from(document.querySelectorAll('.folder-entry')).forEach((elem) => {
  
    /**
     * The dragenter and dragover events need to be overriden
     * in order to implement the drag-and-drop functionality.
     * Read more at:
     * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations
     */
    elem.addEventListener('dragenter', (e) => e.preventDefault());    
    elem.addEventListener('dragover', (e) => e.preventDefault());
  
    elem.addEventListener('drop', (e) => {
      e.preventDefault();

      let dropTargetID: string = null;
  
      // Determine if user dropped on .filename-text element or its parent.
      // They are both acceptable drop locations, but only the parent has the necessary 
      // id in order to locate the drop target Entry in the FS.
      if ((<HTMLElement> e.target).classList.contains('drop-target')) {
        dropTargetID = (<HTMLElement> e.target).parentElement.getAttribute('drop-id');
      }
      
      // get the ID of the element being dragged
      const dragTargetID = (<HTMLElement> currentDragTarget).getAttribute('id');

      // Using dropTargetID, find the object that represents the Folder being dropped into.
      const dropEntry = getEntryById(dropTargetID);
      // Using dragTargetID, find the object that represents the File being dropped.
      const dragEntry = getEntryById(dragTargetID);

      // If both folder and file were found, move the file into the folder. Great success!
      if (dropEntry && dragEntry) {
        moveToFolder(dragEntry, currentFolder, dropEntry as IFolder);
      }
    });
  })
}

/**
 * Checks if dragEntry can be moved to newFolder, and if so, moves it and refreshes dashboard.
 * @param dragEntry 
 * @param parentFolder 
 * @param newFolder 
 */
function moveToFolder(dragEntry: IEntry, parentFolder: IFolder, newFolder: IFolder) {
  const canMove = fs_functions.canMoveEntry(dragEntry, parentFolder, newFolder);
  if (canMove) {
    fs_functions.moveEntry(dragEntry, parentFolder, newFolder);
    // update dashboard
    updateDashboard();
  }
  else {
    window.alert(`Cannot move ${dragEntry.name} into ${newFolder.name}.`);
  }
}

/**
 * Displays dashboard context menu with the appropriate content 
 * 
 * @param view context menu view (determines content of context menu)
 */
function showContextMenu(view: string, clientX: number, clientY: number) {

  console.log(view);

  switch (view) {
    // Context menu options when files/folders are right-clicked
    case 'selection-options':

      // Need to determine selection category before displaying options
      let numberOfSelectedFolders = currentFolderSelection.length;
      let numberOfSelectedFiles = currentFileSelection.length;

      // Loop through selected items to see if they include files and/or folders
      for (let i=0; i<state.getSelectedEntries().length; i++) {
        const entry = state.getSelectedEntries()[i];
        if (entry.type === 'file') numberOfSelectedFiles++;
        else if (entry.type === 'folder') numberOfSelectedFolders++;
      }

      /**
       * Context menu options conditions:
       *    1) 1 file -> open, delete, move
       *    2) 2+ files -> open, delete, move
       *    3) file(s) + folder(s) -> delete, move
       *    4) 1 folder -> open, delete, move
       *    5) 2+ folders -> delete, move
       */

      // 1 file
      if (numberOfSelectedFiles === 1 && numberOfSelectedFolders === 0) {
        contextMenuContentWrapper.innerHTML = contextMenuContent.singleFileOptions;
        setContextMenuItemsEventListeners('single-file-options');
      }
      // 2+ files
      else if (numberOfSelectedFiles > 1 && numberOfSelectedFolders === 0) {
        contextMenuContentWrapper.innerHTML = contextMenuContent.multiFileOptions;
        setContextMenuItemsEventListeners('multi-file-options');
      }
      // file(s) + folder(s)
      else if (numberOfSelectedFiles >= 1 && numberOfSelectedFolders >= 1) {
        contextMenuContentWrapper.innerHTML = contextMenuContent.folderAndFileOptions;
        setContextMenuItemsEventListeners('folder-and-file-options');
      }
      // 1 folder
      else if (numberOfSelectedFiles === 0 && numberOfSelectedFolders === 1) {
        contextMenuContentWrapper.innerHTML = contextMenuContent.singleFolderOptions;
        setContextMenuItemsEventListeners('single-folder-options');
      }
      // 2+ folders
      else if (numberOfSelectedFiles === 0 && numberOfSelectedFolders > 1) {
        contextMenuContentWrapper.innerHTML = contextMenuContent.multiFolderOptions;
        setContextMenuItemsEventListeners('multi-folder-options');
      }
      break;

    // Default context menu (righ-clicking on dashboard background)
    default:
      contextMenuContentWrapper.innerHTML = contextMenuContent.defaultOptions;
      setContextMenuItemsEventListeners('default');
  }

  // get the position of the user's mouse
  contextMenu.style.left = `${clientX}px`;
  contextMenu.style.top = `${clientY}px`;

  // display context menu
  contextMenu.classList.remove('hidden');
}


/**
 * Set event listeners for the menu items in a particular context menu.
 * 
 * @param view The name of the context menu view that is being displayed.
 */
function setContextMenuItemsEventListeners(view: string) {
  // All the buttons that will have events attached to them have the same classname.
  const btnClassname = 'context-menu-item-wrapper';

  switch (view) {

    case 'single-file-options':
      // "Open" menu item
      document.querySelector(`.${btnClassname}#cm-open-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        handleOpenDocuments();
      });

      // "Delete" menu item
      document.querySelector(`.${btnClassname}#cm-delete-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        handleDeleteDocuments();
      });

      // "Move" menu item
      document.querySelector(`.${btnClassname}#cm-move-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        // TODO:
        //handleMoveDocuments();
      });

      break;
    
    case 'multi-file-options':
      // "Open" menu item
      document.querySelector(`.${btnClassname}#cm-open-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        handleOpenDocuments();
      });

      // "Delete" menu item
      document.querySelector(`.${btnClassname}#cm-delete-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        handleDeleteDocuments();
      });

      // "Move" menu item
      document.querySelector(`.${btnClassname}#cm-move-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        // TODO:
        //handleMoveDocuments();
      });      

      break;

    case 'folder-and-file-options':
      // "Delete" menu item
      document.querySelector(`.${btnClassname}#cm-delete-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        handleDeleteDocuments();
      });

      // "Move" menu item
      document.querySelector(`.${btnClassname}#cm-move-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        // TODO:
        //handleMoveDocuments();
      });

      break;
    
    case 'single-folder-options':
      // "Open" menu item
      document.querySelector(`.${btnClassname}#cm-open-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        handleOpenDocuments();
      });

      // "Delete" menu item
      document.querySelector(`.${btnClassname}#cm-delete-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        handleDeleteDocuments();
      });

      // "Move" menu item
      document.querySelector(`.${btnClassname}#cm-move-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        // TODO:
        //handleMoveDocuments();
      });      

      break;

    case 'multi-folder-options':
      // "Delete" menu item
      document.querySelector(`.${btnClassname}#cm-delete-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        handleDeleteDocuments();
      });

      // "Move" menu item
      document.querySelector(`.${btnClassname}#cm-move-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        // TODO:
        //handleMoveDocuments();
      });

      break;

    default:
      // "Upload document" menu item
      document.querySelector(`.${btnClassname}#cm-upload-doc-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        handleOpenUploadArea();
      });

      // "New folder" menu item
      document.querySelector(`.${btnClassname}#cm-new-folder-btn`).addEventListener('click', (e) => {
        contextMenu.classList.add('hidden');
        handleAddFolder();
      });

  }

}


/**
 * Initialize dashboard context menu (right click menu).
 * This will set up all necessary event listeners as well as
 * the logic to determine the content of the context menu, which
 * may change depending on where the user right-clicks (file, files, folder, background, etc.)
 */
function initializeDefaultContextMenu() {

  // right-click on dashboard background
  document.querySelector('.main-section').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(
      'default', 
      (<MouseEvent> e).clientX, 
      (<MouseEvent> e).clientY
    );
  });
}


/**
 * Add listeners for specific context menus.
 * Specific context menus appear when user right-clicks on selected files/folders.
 * The actual menu that is shown depends on the type of selection.
 */
function addSpecificContextMenuListeners() {
    
  // right-click on folder item (file or folder)
  Array.from(document.querySelectorAll('.document-entry')).forEach( (elem) => {
    elem.addEventListener('contextmenu', (e) => {
      e.stopPropagation();
      e.preventDefault();

      showContextMenu(
        'selection-options', 
        (<MouseEvent> e).clientX, 
        (<MouseEvent> e).clientY
      );
      contextMenu.classList.remove('hidden');
    })
  });

  // hide context menu if user clicks away
  mainSection.addEventListener('click', (e) => {
    contextMenu.classList.add('hidden');
  });
}

/**
 * Loads root folder into dashboard on startup. 
 */
export const loadDashboard = async (): Promise<void> => {
  const root = await fsm.getRoot();
  updateDashboard([root]);
  initializeDefaultContextMenu();
}