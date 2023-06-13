import { fetchUploadedDocuments, fetchSampleDocuments, deleteEntry } from './Storage';
import { formatFilename } from './functions';
import { samples } from './samples_filenames';

const uploadedDocsContainer = document.querySelector('#uploaded-docs-content');
const sampleDocsContainer = document.querySelector('#sample-docs-content');
const openButton: HTMLButtonElement = document.querySelector('#open-doc');
const deleteButton: HTMLButtonElement = document.querySelector('#remove-doc');

let metaKeyIsPressed = false;
let shiftKeyIsPressed = false;

// Lists the documents in order as represented on dashboard
let orderedDocuments: string[];
let orderedSelection: boolean[];

// Shift selection mimics MacOS behaviour
class shiftSelection {
  private start;
  private end;
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

// Gets user selected document folio elements
function getSelectionFolios() {
  return getSelectionFilenames().map(filename => document.getElementById(filename));
}

// gets user selected filenames
function getSelectionFilenames() {
  return orderedDocuments.filter((_, idx) => orderedSelection[idx]);
}

// Open editor tab
function openEditorTab(filename: string, isUploaded: boolean) {
  const params = (isUploaded)
    ? { storage: filename }
    : { manifest: filename };
  const query = makeQuery(params);
  window.open(`./editor.html?${query}`, '_blank');
}

// Opens editor tab given a document folio element
function openFolio(folio: Element) {
  const isUploaded = (folio.classList.contains('uploaded-doc')) ? true : false;
  const filename = folio.id;
  openEditorTab(filename, isUploaded);
}

function makeQuery(obj): string {
  return Object.keys(obj).map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
  }).join('&');
}

function unselect(folio: Element, idx?: number) {
  if (folio != null) {
    idx = (idx != undefined) ? idx : orderedDocuments.indexOf(folio.id);
  }
  else if (idx != undefined) {
    folio = document.getElementById(orderedDocuments[idx]);
  }
  else return;
  folio.classList.remove('selected');
  orderedSelection[idx] = false;
}

function unselectAll() {
  Array.from(document.querySelectorAll('.document-entry.selected'))
    .forEach((folio) => folio.classList.remove('selected'));
  orderedSelection.fill(false);
}

function select(folio: Element, idx?: number) {
  if (folio != null) {
    idx = (idx != undefined) ? idx : orderedDocuments.indexOf(folio.id);
  }
  else if (idx != undefined) {
    folio = document.getElementById(orderedDocuments[idx]);
  }
  else return;
  folio.classList.add('selected');
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
    if (lastIdx < (orderedDocuments.length - samples.length)) {
      deleteButton.classList.add('active');
    }
    else {
      deleteButton.classList.remove('active');
    }
  }
}

export async function updateDocumentSelector(): Promise<void> {
  shift.reset();
  // load user-uploaded docs
  uploadedDocsContainer.innerHTML = '';
  const uploadedDocs = await fetchUploadedDocuments();
  uploadedDocs.sort();

  if (uploadedDocs.length === 0) {
    const doc = document.createElement('div');
    doc.setAttribute('id', 'no-uploaded-docs');
    doc.innerHTML = 'No Documents Uploaded';
    uploadedDocsContainer.appendChild(doc);
  }
  else uploadedDocs.forEach(filename => {
    const doc = document.createElement('div');
    doc.setAttribute('id', filename);
    doc.classList.add('document-entry');
    doc.classList.add('uploaded-doc');

    const name = document.createElement('div');
    name.classList.add('filename-text');
    name.innerHTML = formatFilename(filename, 25);
    doc.appendChild(name);

    uploadedDocsContainer.appendChild(doc);
  });

  // load sample docs
  sampleDocsContainer.innerHTML = '';

  const sampleDocs = fetchSampleDocuments();
  sampleDocs.sort();

  if (sampleDocs.length === 0) {
    const doc = document.createElement('div');
    doc.setAttribute('id', 'no-sample-docs');
    doc.innerHTML = 'No Documents Uploaded';
    sampleDocsContainer.appendChild(doc);
  }
  else sampleDocs.forEach(filename => {
    const doc = document.createElement('div');
    doc.setAttribute('id', filename);
    doc.classList.add('document-entry');

    const name = document.createElement('div');
    name.classList.add('filename-text');
    name.innerHTML = formatFilename(filename, 25);
    doc.appendChild(name);

    sampleDocsContainer.appendChild(doc);
  });
  // Clear list of documents/selections and update
  orderedDocuments = uploadedDocs.concat(samples);
  orderedSelection = new Array<boolean>(orderedDocuments.length).fill(false);

  // add onclick event listener to docs
  orderedDocuments.forEach((filename, idx) => {
    const folio = document.getElementById(`${filename}`);

    // double click event immediately opens document
    folio.addEventListener('dblclick', handleOpenDocuments, false);

    // Single click selects document or adds document to existing selection
    folio.addEventListener('click', function(e) {
      // No Shift or Meta pressed
      if (!metaKeyIsPressed && !shiftKeyIsPressed) {
        // Selected or not selected -> clear selection and select cur folio
        unselectAll();
        select(folio, idx);
        shift.setStart(idx); // Track start of shift selection
        setSidebarActions();
      }
      // Meta key pressed (default behaviour if both meta and shift are pressed)
      else if (metaKeyIsPressed) {
        if (orderedSelection[idx]) {
          unselect(folio, idx);
          shift.setStart(orderedSelection.lastIndexOf(true)); // MacOS behaviour: shift start goes to largest idx selected item
        }
        // Folio is not selected -> Add to selection
        else {
          select(folio, idx);
          shift.setStart(idx); // Track start of shift selection
        }
        setSidebarActions();
      }
      // Marks the end of shift selection
      else if (shiftKeyIsPressed) {
        // Unselect previous shift selection if applicable
        shift.getPrevSelection().forEach((index) => {
          unselect(null, index);
        })
        // Select new shift select
        shift.setEnd(idx);
        shift.getSelection().forEach((index) => {
          select(null, index);
        });
        setSidebarActions();
      }
    }, false);
  });
}

function handleOpenDocuments() {
  if (!openButton.classList.contains('active')) return;
  getSelectionFolios().forEach(folio => {
    openFolio(folio);
  });
  shift.reset();
  unselectAll();
  setSidebarActions();
}

function handleDeleteDocuments() {
  if (!deleteButton.classList.contains('active')) return;

  const filenames = getSelectionFilenames();
  const filenameFormatted = filenames.join('\n');
  const alertMessage = 'Are you sure you want to delete:\n' + filenameFormatted + '\n\nThis action is irreversible.';
  const isConfirmed = window.confirm(alertMessage);

  if (isConfirmed) {
    const promises = filenames.map(filename => deleteEntry(filename));
    Promise.all(promises)
      .then( () => {
        updateDocumentSelector();
      })
      .catch( err => console.debug('failed to delete files: ', err));

    unselectAll();
    shift.reset();
  }
  setSidebarActions();
}

export const InitDocumentSelector = (): void => {
  openButton!.addEventListener('click', handleOpenDocuments);
  deleteButton!.addEventListener('click', handleDeleteDocuments);

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

  updateDocumentSelector();
}