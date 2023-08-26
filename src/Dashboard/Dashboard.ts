import { IEntry, IFile, IFolder, fs_functions } from './FileSystem';
import { deleteDocument, updateDocument } from './Storage';
import { formatFilename } from './upload_functions';
import { FileSystemManager } from './FileSystem';
import { ShiftSelectionManager, dashboardState } from './dashboard_functions';
import { InitUploadArea } from './UploadArea';
import * as contextMenuContent from './ContextMenuContent';
import { ModalWindow, ModalWindowView } from '../utils/ModalWindow';

const documentsContainer: HTMLDivElement = document.querySelector('#fs-content-container');
const backgroundArea: HTMLDivElement = document.querySelector('#main-section-content');
const openButton: HTMLButtonElement = document.querySelector('#open-doc');
const deleteButton: HTMLButtonElement = document.querySelector('#remove-doc');
const navPathContainer: HTMLDivElement = document.querySelector('#nav-path-container');
let backButton: HTMLButtonElement = document.querySelector('#fs-back-btn');
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

openButton?.addEventListener('click', handleOpenDocuments);
deleteButton?.addEventListener('click', handleDeleteDocuments);
uploadDocumentsButton?.addEventListener('click', handleOpenUploadArea);
newFolderButton?.addEventListener('click', openNewFolderWindow);

// Sorting algorithms
// const sortByAlphanumerical = (a: IEntry, b: IEntry) => a.name.localeCompare(b.name);
// const sortByTime = (a: IEntry, b: IEntry) => {
//   const aTime = a.metadata['created_on'];
//   const bTime = b.metadata['created_on'];
//   if (aTime && bTime) return aTime - bTime;
//   else if (aTime) return -1;
// };

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

backgroundArea?.addEventListener('click', (e) => {
  const target = e.target as Element;
  // Lose focus if click event in main section is not a document tile
  const isDocument = Boolean(target.closest('.document-entry'));
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
  const entry = state.getEntries().at(index);
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
  const container = document.createElement('div');
  container.classList.add('document-entry');
  container.setAttribute('draggable', 'true'); // make file or folder draggable

  const icon = document.createElement('img');
  icon.classList.add('document-icon');
  const name = document.createElement('div');
  name.innerText = formatFilename(entry.name, 25);

  switch (entry.type) {
    case 'folder':
      // set type attrib and id
      container.classList.add('folder-entry');
      container.setAttribute('id', entry.name);
      // set icon
      icon.src = './Neon-gh/assets/img/folder-icon.svg';
      // set drop target attrib
      container.setAttribute('drop-id', entry.name);
      container.classList.add('drop-target');
      break;
    case 'file':
      container.classList.add('file-entry');
      container.setAttribute('id', (entry as IFile).content);

      // determine which icon and class to add depending on existing metadata
      if (entry.metadata['type'] === 'manuscript') {
        // set type attrib and id
        container.classList.add('manuscript-entry');
        // set icon
        icon.src = './Neon-gh/assets/img/manuscript-icon.svg';
      }
      else if (entry.metadata['type'] === 'folio') {
        // set type attrib and id
        container.classList.add('folio-entry');
        // set icon
        icon.src = './Neon-gh/assets/img/folio-icon.svg';
      }
      else {
        // set icon for no type
        icon.src = './Neon-gh/assets/img/folio-icon.svg';
      }

      break;
  }


  container.appendChild(icon);
  container.appendChild(name);

  return container;
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
  tile.addEventListener('click', function(_e) {
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
  // Open folder if only one folder is selected
  if (state.getSelectedFolders().length === 1) {
    const newPath = [...state.getFolderPath(), state.getSelectedEntries()[0] as IFolder];
    updateDashboard(newPath);
    return;
  }

  // Open all files, ignoring if folders are selected
  state.getSelectedFiles().forEach((entry: IEntry) => openFile(entry as IFile));
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
      deleteDocument(file.content)
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
  const nothingSelected = state.getSelection().every((selected) => !selected);
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

  // create nav elements and add event listeners
  const navElements = state.getFolderPath().map((folder, idx) => {
    const navSection = document.createElement('div');
    navSection.classList.add('nav-path-section');
    navSection.innerHTML = folder.name;

    const targetPath = state.getFolderPath().slice(0, idx + 1);
    navSection.addEventListener('click', async () => await updateDashboard(targetPath));
    // add drop target to move dragged element to the prospective folders
    addDropTargetListeners(navSection, state.getParentFolder(), targetPath.at(-1));

    return navSection;
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
  // Erase previous event listeners
  const buttonClone = backButton.cloneNode(true) as HTMLButtonElement;
  backButton.parentNode.replaceChild(buttonClone, backButton);

  // Disable back button if at root
  const isRoot = state.getFolderPath().length === 1;
  if (isRoot) {
    buttonClone.classList.remove('active');
    buttonClone.setAttribute('disabled', 'true');
  }
  else {
    buttonClone.classList.add('active');
    buttonClone.removeAttribute('disabled');
    buttonClone.addEventListener('click', handleNavigateBack);
    buttonClone.addEventListener('ondragenter', () => buttonClone.classList.add('active'));
    buttonClone.addEventListener('ondragleave', () => buttonClone.classList.remove('active'));
    addDropTargetListeners(buttonClone, state.getParentFolder(), state.getFolderPath().at(-2));
  }
  backButton = buttonClone;
}

/**
 * Handles click event on back button to go back one folder if possible
 */
async function handleNavigateBack() {
  const newPath = state.getFolderPath().slice(0, -1);
  await updateDashboard(newPath);
}

/**
 * Add new Folder to current folder and refresh dashboard
 */
function handleAddFolder(folderName: string) {
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

  const newFolder = fs_functions.createFolder(folderName);
  const succeeded = fs_functions.addEntry(newFolder, state.getParentFolder());
  if (succeeded) {
    newFolderTile.setAttribute('id', folderName);
    updateDashboard();
    return true;
  }
  else {
    newFolderTile.remove();
    return false;
  }
}

/**
 * Renames current selection of document on dashboard, updating the database for files
 * 
 * @param entry IEntry to rename
 */
function renameEntry(entry: IEntry, newName: string) {
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
  
  const succeeded = fs_functions.renameEntry(entry, state.getParentFolder(), newName);
    if (succeeded) {
      // Update database if entry is a file
      if (entry.type === 'file') {
        const file = entry as IFile;
        updateDocument(file.content, newName)
          .then(() => {
            updateDashboard();
          })
      }
      else {
        updateDashboard();
      }
    }
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
  const currentFolder = state.getParentFolder();
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

  addSpecificContextMenuListeners();
  updateActionBarButtons();
  updateNavPath();
  updateBackButton();

  // add drag and drop listeners for current folder content
  currentFolder.content.forEach((entry) => {
    const id = getEntryId(entry);
    const tile = document.getElementById(id);
    addDragStartListener(tile);

    if (entry.type === 'folder') { 
      addDropTargetListeners(tile, currentFolder, entry as IFolder);
    }
  });
  
  fsm.setFileSystem(state.getFolderPath().at(0));
}

function addDragStartListener(elem: Element) {
  elem.addEventListener('dragstart', (e: DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    currentDragTarget = e.target;
  });
}

function addDropTargetListeners(elem: Element, currentFolder: IFolder, destinationFolder: IFolder) {
  /**
     * The dragenter and dragover events need to be overriden in order to implement the drag-and-drop functionality.
     * Read more at: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations
     */
  elem.addEventListener('dragenter', (e) => {
    e.preventDefault();
    elem.classList.add('dragenter');
  });    
  elem.addEventListener('dragleave', (e) => {
    e.preventDefault();
    elem.classList.remove('dragenter');
  });
  elem.addEventListener('dragover', (e) => e.preventDefault());

  elem.addEventListener('drop', createHandleDrop(currentFolder, destinationFolder));
}

function createHandleDrop(currentFolder: IFolder, destinationFolder: IFolder) {
  return (e: Event) => {
    e.preventDefault();

    // get the ID of the element being dragged
    const dragTargetID = (<HTMLElement> currentDragTarget).getAttribute('id');

    // Using dragTargetID, find the object that represents the File being dropped.
    const dragEntry = getEntryById(dragTargetID);

    // If folder, destination, and file were found, move the file into the folder. Great success!
    // Make sure that a folder is not being dropped into the same folder.
    if (dragEntry && dragEntry !== destinationFolder) {
      moveToFolder([dragEntry], currentFolder, destinationFolder);
    }
  };
}

/**
 * Checks if entry can be moved to newFolder, and if so, moves it and refreshes dashboard.
 * 
 * @param entry 
 * @param parentFolder 
 * @param newFolder 
 */
function moveToFolder(entries: IEntry[], parentFolder: IFolder, newFolder: IFolder) {
  const errorMessages = [];
  entries.forEach((entry) => {
    const response = fs_functions.canMoveEntry(entry, parentFolder, newFolder);
    if (!response.succeeded) errorMessages.push(response.error);
    else fs_functions.moveEntry(entry, parentFolder, newFolder);
  });
  
  errorMessages.filter((msg, idx, arr) => arr.indexOf(msg) === idx);
  if (errorMessages.length > 0) window.alert(errorMessages.join('\n'));

  updateDashboard();
}

/**
 * Opens Move-To menu modal window with UI for moving selected entries to a new folder.
 */
function openMoveToWindow() {
  // generate modal window
  const modalWindow = new ModalWindow();
  modalWindow.setModalWindowView(ModalWindowView.MOVE_TO);
  modalWindow.openModalWindow();

  const selectedEntries = state.getSelectedEntries();
  const parentFolder = state.getParentFolder();

  // Callback for when user double-clicks on a folder and moves selection
  const moveToCallback = (newParentFolder: IFolder) => {
    modalWindow.hideModalWindow();
    moveToFolder(selectedEntries, parentFolder, newParentFolder);
  };

  const rootTree = generateRootTree(moveToCallback);
  const treeContainer = document.createElement('div');
  treeContainer.classList.add('tree-container');
  treeContainer.appendChild(rootTree);

  const modalContainer = document.getElementById('neon-modal-window-content-container');
  modalContainer.innerHTML = '<span class="move-menu-msg">Double-click the folder you want to move your items to!</span>';
  modalContainer.appendChild(treeContainer);
}

/**
 * Opens New Folder menu modal window that prompts for a name.
 * On clicking the Create button, closes modal window and creates new folder.
 */
function openNewFolderWindow() {
  // generate modal window
  const modalWindow = new ModalWindow();
  modalWindow.setModalWindowView(ModalWindowView.NEW_FOLDER);
  modalWindow.openModalWindow();

  
  const inputContainer = document.getElementById('rename_input_container') as HTMLDivElement;
  const cancelButton = document.getElementById('cancel_rename') as HTMLButtonElement;
  const confirmButton = document.getElementById('confirm_rename') as HTMLButtonElement;

  const input = document.createElement('input');
  input.id = 'rename_input';
  input.type = 'text';
  input.placeholder = 'Untitled Folder';
  input.value = 'Untitled Folder';
  inputContainer.appendChild(input);

  input.select();
  input.focus();

  cancelButton.addEventListener('click', () => modalWindow.hideModalWindow());
  confirmButton.addEventListener('click', () => confirmNewFolderAction(modalWindow, input));

  inputContainer.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      modalWindow.hideModalWindow();
    } else if (event.key === 'Enter') {
      confirmNewFolderAction(modalWindow, input);
    }
  });
}

function confirmNewFolderAction(modalWindow: ModalWindow, input: HTMLInputElement) {
  const folderName = input.value;
  modalWindow.hideModalWindow();
  handleAddFolder(folderName);
}

/**
 * Opens Rename menu modal window that prompts for a new name.
 */
function openRenameWindow() {
  // generate modal window
  const modalWindow = new ModalWindow();
  modalWindow.setModalWindowView(ModalWindowView.RENAME);
  modalWindow.openModalWindow();

  const inputContainer = document.getElementById('rename_input_container') as HTMLDivElement;
  const cancelButton = document.getElementById('cancel_rename') as HTMLButtonElement;
  const confirmButton = document.getElementById('confirm_rename') as HTMLButtonElement;

  const input = document.createElement('input');
  input.id = 'rename_input';
  input.type = 'text';
  const prevName = state.getSelectedEntries()[0].name;
  input.placeholder = prevName;
  input.value = prevName;
  inputContainer.appendChild(input);

  input.select();
  input.focus();

  cancelButton.addEventListener('click', () => modalWindow.hideModalWindow());
  confirmButton.addEventListener('click', () => confirmRenameAction(modalWindow, input));

  inputContainer.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      modalWindow.hideModalWindow();
    } else if (event.key === 'Enter') {
      confirmRenameAction(modalWindow, input);
    }
  });
  
}

// On confirmation, close modal window and rename entry (if file, database is updated)
function confirmRenameAction(modalWindow: ModalWindow, input: HTMLInputElement) {
  const folderName = input.value;
  modalWindow.hideModalWindow();
  const entry = state.getSelectedEntries()[0];
  renameEntry(entry, folderName);
}

/**
 * Recursive function to generate folder tree structure for move-to menu
 * 
 * @param folder IFolder to generate tree structure for and all its subfolders
 * @param callback Callback function for when user double-clicks on a folder and moves selection
 * @param degree The level of subfolders deep
 * @returns List item node
 */
function generateFolderTree(folder: IFolder, moveToCallback: (newParentFolder :IFolder) => void, degree: number): HTMLLIElement {

  const tree = document.createElement('li');
  // container for folder name and arrow
  const liContainer = document.createElement('div');
  liContainer.classList.add('tree-li-container');

  // Folder TEXT: click to select (for UX), double click to move items to folder
  const folderName = document.createElement('div');
  folderName.classList.add('tree-name');
  folderName.innerHTML = folder.name;

  // On single click, highlight/select folder name
  folderName.addEventListener('click', () => {
    document.querySelectorAll('.tree-name').forEach(elem => elem.classList.remove('selected'));
    folderName.classList.add('selected');
  });

  // On double click, move selected items to folder
  folderName.addEventListener('dblclick', () => {
    moveToCallback(folder);
  });

  // If Folder has no subfolders, return without nested ul
  const isLeaf = folder.content.every(entry => entry.type !== 'folder');
  if (isLeaf) {
    tree.appendChild(liContainer);
    liContainer.appendChild(folderName);
    return tree;
  }
  // Otherwise Folder is not empty, make tree structure

  // Unordered LIST (hiding or unhiding li)
  const ul = document.createElement('ul');

  // ARROW
  const arrow = document.createElement('div');
  arrow.classList.add('tree-arrow');
  arrow.innerHTML = '▶';

  // if more than ... subfolders down, hide by default
  if (degree < 2) ul.classList.add('active');
  if (degree < 2) arrow.classList.add('active');
  
  arrow.addEventListener('click', () => {
    arrow.classList.toggle('active');
    ul.classList.toggle('active');
  });

  tree.appendChild(liContainer);
  liContainer.appendChild(arrow);
  liContainer.appendChild(folderName);
  tree.appendChild(ul);

  // Append folder contents
  folder.content.forEach((entry) => {
    if (entry.type === 'folder') {
      const folderTree = generateFolderTree(entry as IFolder, moveToCallback, degree + 1);
      ul.appendChild(folderTree);
    }
  });
  return tree;
}

/**
 * Generates entire file system folder tree for move-to menu
 * 
 * @param moveToCallback callback function for when user double-clicks on a folder and moves selection
 * @returns 
 */
function generateRootTree(moveToCallback: (newParentFolder :IFolder) => void): HTMLUListElement {
  const rootTree = document.createElement('ul');
  rootTree.id = 'tree-root';
  rootTree.appendChild(generateFolderTree(state.root(), moveToCallback, 0));
  return rootTree;
}

/**
 * Displays dashboard context menu with the appropriate content 
 * 
 * @param view context menu view (determines content of context menu)
 */
function showContextMenu(view: string, clientX: number, clientY: number) {

  switch (view) {
    // Context menu options when files/folders are right-clicked
    case 'selection-options':

      // Need to determine selection category before displaying options
      const numberOfSelectedFiles = state.getSelectedFiles().length;
      const numberOfSelectedFolders = state.getSelectedFolders().length;

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
      document.querySelector(`.${btnClassname}#cm-open-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        handleOpenDocuments();
      });

      // "Delete" menu item
      document.querySelector(`.${btnClassname}#cm-delete-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        handleDeleteDocuments();
      });

      // "Rename" menu item
      document.querySelector(`.${btnClassname}#cm-rename-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        openRenameWindow();
      });

      // "Move" menu item
      document.querySelector(`.${btnClassname}#cm-move-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        openMoveToWindow();   
      });



      break;
    
    case 'multi-file-options':
      // "Open" menu item
      document.querySelector(`.${btnClassname}#cm-open-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        handleOpenDocuments();
      });

      // "Delete" menu item
      document.querySelector(`.${btnClassname}#cm-delete-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        handleDeleteDocuments();
      });

      // "Move" menu item
      document.querySelector(`.${btnClassname}#cm-move-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        openMoveToWindow();
      });      

      break;

    case 'folder-and-file-options':
      // "Delete" menu item
      document.querySelector(`.${btnClassname}#cm-delete-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        handleDeleteDocuments();
      });

      // "Move" menu item
      document.querySelector(`.${btnClassname}#cm-move-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        openMoveToWindow();
      });

      break;
    
    case 'single-folder-options':
      // "Open" menu item
      document.querySelector(`.${btnClassname}#cm-open-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        handleOpenDocuments();
      });

      // "Delete" menu item
      document.querySelector(`.${btnClassname}#cm-delete-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        handleDeleteDocuments();
      });

      // "Rename" menu item
      document.querySelector(`.${btnClassname}#cm-rename-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        openRenameWindow();
      });

      // "Move" menu item
      document.querySelector(`.${btnClassname}#cm-move-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        openMoveToWindow();
      });      

      break;

    case 'multi-folder-options':
      // "Delete" menu item
      document.querySelector(`.${btnClassname}#cm-delete-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        handleDeleteDocuments();
      });

      // "Move" menu item
      document.querySelector(`.${btnClassname}#cm-move-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        openMoveToWindow();
      });

      break;

    default:
      // "Upload document" menu item
      document.querySelector(`.${btnClassname}#cm-upload-doc-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        handleOpenUploadArea();
      });

      // "New folder" menu item
      document.querySelector(`.${btnClassname}#cm-new-folder-btn`).addEventListener('click', (_e) => {
        contextMenu.classList.add('hidden');
        openNewFolderWindow();
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
    });
  });

  // hide context menu if user clicks away
  mainSection.addEventListener('click', (_e) => {
    contextMenu.classList.add('hidden');
  });
}

/**
 * Loads root folder into dashboard on startup. 
 */
export const loadDashboard = async (): Promise<void> => {
  const root = await fsm.getRoot();
  state.root(root);
  updateDashboard([root]);
  initializeDefaultContextMenu();
};