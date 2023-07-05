import { IEntry, IFile, IFolder, fs_functions } from './FileSystem';
import { deleteEntry } from './Storage';
import { formatFilename } from './functions';
import FileSystemManager from './FileSystem/FileSystemManager';

const documentsContainer = document.querySelector('#fs-content-container');
const openButton: HTMLButtonElement = document.querySelector('#open-doc');
const deleteButton: HTMLButtonElement = document.querySelector('#remove-doc');

const navBackButton: HTMLButtonElement = document.querySelector('#fs-back-btn');
const navPathContainer: HTMLDivElement = document.querySelector('#fs-path-container');

let metaKeyIsPressed = false;
let shiftKeyIsPressed = false;

// Lists the documents in order as represented on dashboard
let orderedEntries: IEntry[];
let orderedSelection: boolean[];
let currentPath: IFolder[];

// Shift selection mimics MacOS behaviour
class shiftSelection {
  private start: number;
  private end: number;
  private prevSelection: number[] = [];

  public constructor() {
    this.reset();
  }

  public setStart(start: number) {
    this.reset();
    this.start = Math.max(start, 0);
  }

  public setEnd(end: number) {
    this.end = end;
  }

  public reset() {
    this.start = 0;
    this.end = -1;
    this.prevSelection.splice(0);
  }

  public getPrevSelection() {
    return this.prevSelection;
  }

  public getSelection() {
    let start: number;
    let end: number;

    if (this.end === -1) {
      return [];
    }
    if (this.end < this.start) {
      start = this.end;
      end = this.start + 1;
    }
    else {
      start = this.start;
      end = this.end + 1;
    }
    const range = Array.from({ length: (end - start) }, (v, k) => k + start);

    // For each shift selection action: if the Shift key is still held, the end shift pos can change
    // with the previously (before-shift) selected elements still selected while the current shift selections unselect.
    const specificSelection = range.filter(idx => !(orderedSelection[idx]));
    this.prevSelection = specificSelection;
    return specificSelection;
  }
}

const shift = new shiftSelection();

// gets user selected filenames
function getSelectionFilenames() {
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

// Determines whether to set delete doc or open doc to active
function setSidebarActions() {
  // -1 if no selection, some value i if selected.
  // if (idx=i) > orderedDocuments.length - samples.length, then no user uploads are selected.
  const lastIdx = orderedSelection.lastIndexOf(true);
  if (lastIdx === -1) {
    openButton.classList.remove('active');
    deleteButton.classList.remove('active');
  }
  else {
    openButton.classList.add('active');
    deleteButton.classList.add('active');
  }
}

// Creates a folder, folio, or manuscript tile element
function createTile(entry: IEntry) {
  const doc = document.createElement('div');
  doc.setAttribute('id', entry.name);
  doc.classList.add('document-entry');
  switch (entry.type) {
    case 'folder':
      doc.classList.add('folder-entry');
      break;
    case 'file':
      doc.classList.add('file-entry');
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
      shift.setStart(index); 
    }
    else if (metaKeyIsPressed) {
      if (orderedSelection[index]) {
        unselect(index, tile);
        shift.setStart(orderedSelection.lastIndexOf(true));
      }
      else {
        select(index, tile);
        shift.setStart(index); 
      }
    }
    else if (shiftKeyIsPressed) {
      shift.getPrevSelection().forEach((idx) => {
        unselect(idx);
      });
      shift.setEnd(index);
      shift.getSelection().forEach((idx) => {
        select(idx);
      });
    }
    setSidebarActions();
  }, false);
}

function handleOpenDocuments() {
  getSelectionFilenames().forEach((entry: IEntry) => {
    // Open document if it is a file and not a folder
    if (entry.type === 'file') openFile(entry as IFile);
  });
  shift.reset();
  unselectAll();
  setSidebarActions();
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

  const allEntries = getSelectionFilenames();
  const selectedEntries = allEntries.filter(entry => entry.metadata['document'] !== 'sample');
  const selectedSamples = allEntries.filter(entry => entry.metadata['document'] === 'sample');

  // Create a formatted list of filenames to display in alert message
  const createList = (entryArray: IEntry[]) => entryArray.map(entry => `- ${entry.name} (${entry.type})`).join('\n');

  let alertMessage = 'Are you sure you want to delete:\n' + createList(allEntries) + '\n\nThis action is irreversible.'
  
  if (selectedSamples.length > 0) {
    const sampleMessage = '\nCannot delete sample documents:\n ' + createList(selectedSamples);
    alertMessage += sampleMessage;
  }

  const isConfirmed = window.confirm(alertMessage);

  if (isConfirmed) {
    const deletePromises = selectedEntries.map(entry => {
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

function handleNavigateBack() {
  const newPath = currentPath.slice(0, -1);
  updateDocumentSelector(newPath);
}

export async function updateDocumentSelector(newPath?: IFolder[]): Promise<void> {
  if (!newPath) newPath = currentPath;
  currentPath = newPath;
  const folder = newPath.at(-1);

  // clear content
  documentsContainer.innerHTML = '';
  shift.reset();

  // update ordered items for current fs-contents
  orderedEntries = folder.content;
  orderedSelection = new Array<boolean>(orderedEntries.length).fill(false);
  shift.reset();

  // populate folder contents
  folder.content.forEach(async (entry, index) => {
    const { name, type } = entry;
    const tile = createTile(entry);
    documentsContainer.appendChild(tile);
    await addTileEventListener(index, entry, tile);
  }); 

  function updateNavPath(currentPath: IFolder[]) {
    navPathContainer.innerHTML = '';
    
    function handleNavClick(targetPath: IFolder[]): () => void {
      return async () => await updateDocumentSelector(targetPath);
    }

    currentPath.forEach((folder, idx) => {
      const navSection = document.createElement('div');
      navSection.classList.add('nav-section');
      navSection.innerHTML = folder.name;
      navSection.addEventListener('dblclick', handleNavClick(currentPath.slice(0, idx + 1)));
      navPathContainer.appendChild(navSection);
      navPathContainer.appendChild(document.createTextNode(' / '));
    });
  }

  // update path display
  updateNavPath(currentPath);

  // update back button if at root
  if (newPath.length === 1) {
    navBackButton.disabled = true;
  }
  else {
    navBackButton.disabled = false;
  }
}

export const InitDocumentSelector = async (): Promise<void> => {
  const fsm = await FileSystemManager();

  openButton!.addEventListener('click', handleOpenDocuments);
  deleteButton!.addEventListener('click', handleDeleteDocuments);
  navBackButton!.addEventListener('click', handleNavigateBack);

  window.addEventListener('keydown', (e) => {
    if (e.metaKey) metaKeyIsPressed = true;
    if (e.shiftKey) shiftKeyIsPressed = true;
    // Lose focus on esc key
    if (e.key === 'Escape') {
      unselectAll();
      shift.reset();
      setSidebarActions();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (!e.metaKey) metaKeyIsPressed = false;
    if (!e.shiftKey) shiftKeyIsPressed = false;
  });

  // Lose focus if click event in main section is not a button
  const background: HTMLElement = document.querySelector('.main-section-content');
  background.addEventListener('click', function(e) {
    const classList = (<Element>e.target).classList;
    if ( !['document-entry', 'filename-text'].some(className => classList.contains(className)) ) {
      unselectAll();
      shift.reset();
      setSidebarActions();
    }
  });

  const root = fsm.getRoot();
  updateDocumentSelector([root]);
}