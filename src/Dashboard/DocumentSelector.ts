import { IEntry, IFile, IFolder, fs_functions } from './FileSystem';
import { deleteEntry } from './Storage';
import { formatFilename } from './functions';
import FileSystemManager from './FileSystem/FileSystemManager';

const documentsContainer = document.querySelector('#fs-content-container');
const openButton: HTMLButtonElement = document.querySelector('#open-doc');
const deleteButton: HTMLButtonElement = document.querySelector('#remove-doc');

const navBackButton: HTMLButtonElement = document.querySelector('#fs-back-btn');
const navPath: HTMLDivElement = document.querySelector('#fs-path');

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
  private prevSelection = [];

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
    .forEach((tile) => tile.classList.remove('selected'));
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
    case 'file':
      doc.classList.add('file-entry');
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
    const folder = entry as IFolder;
    const enterFolder = async () => await updateDocumentSelector([...currentPath, folder]);
    tile.addEventListener('dblclick', enterFolder, false);
  }
  else {
    tile.addEventListener('dblclick', handleOpenDocuments, false);
    addShiftSelectionBehaviour(tile, index);
  }
}

// Single click selects document or adds document to existing selection, unless it's a folder in which case is ignored
function addShiftSelectionBehaviour(tile: HTMLDivElement, index: number) {
  tile.addEventListener('click', function(e) {
    // No Shift or Meta pressed
    if (!metaKeyIsPressed && !shiftKeyIsPressed) {
      // Selected or not selected -> clear selection and select cur tile
      unselectAll();
      select(index, tile);
      shift.setStart(index); // Track start of shift selection
      setSidebarActions();
    }
    // Meta key pressed (default behaviour if both meta and shift are pressed)
    else if (metaKeyIsPressed) {
      if (orderedSelection[index]) {
        unselect(index, tile);
        shift.setStart(orderedSelection.lastIndexOf(true)); // MacOS behaviour: shift start goes to largest index selected item
      }
      // Tile is not selected -> Add to selection
      else {
        select(index, tile);
        shift.setStart(index); // Track start of shift selection
      }
      setSidebarActions();
    }
    // Marks the end of shift selection
    else if (shiftKeyIsPressed) {
      // Unselect previous shift selection if applicable
      shift.getPrevSelection().forEach((index) => {
        unselect(index);
      })
      // Select new shift select
      shift.setEnd(index);
      shift.getSelection().forEach((index) => {
        select(index);
      });
      setSidebarActions();
    }
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
  const selectedEntries = getSelectionFilenames();
  const selectedSamples = selectedEntries.filter(entry => entry.metadata['document'] === 'sample');
  const entriesWithoutSamples = selectedEntries.filter(entry => entry.metadata['document'] !== 'sample');

  const filenameFormatted = entriesWithoutSamples.map(entry => entry.name).join('\n');

  const sampleMessage = (selectedSamples.length > 0) 
                        ? '\nCannot delete sample documents:\n ' + selectedSamples.map(entry => entry.name).join('\n')
                        : '';

  const alertMessage = 'Are you sure you want to delete:\n' + filenameFormatted + '\n\nThis action is irreversible.' + sampleMessage;
  const isConfirmed = window.confirm(alertMessage);

  if (isConfirmed) {
    const promises = selectedEntries.map(entry => {
      if (entry.type === 'file') {
        return deleteEntry((entry as IFile).content)
      }
      // only delete a folder if it is empty
      else if (entry.type === 'folder') {
        const isEmpty = (entry as IFolder).content.length === 0;

        return new Promise((resolve) => {
          if (isEmpty) {
            fs_functions.removeEntry(entry, currentPath.at(-1));
            resolve(true);
          }
          else {
            window.alert(`Cannot delete ${entry.name}: folder is not empty.`);
            resolve(false);
          }
        });
      }
    });
    Promise.all(promises)
      .then( () => {
        updateDocumentSelector(currentPath);
      })
      .catch( err => console.debug('failed to delete files: ', err));
    unselectAll();
    shift.reset();
    setSidebarActions();
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

  // update path display
  const pathDisplay = newPath.map((entry) => entry.name).join(' / ');
  navPath.innerHTML = pathDisplay;

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