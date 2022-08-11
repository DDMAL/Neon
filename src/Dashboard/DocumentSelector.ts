import { getAllDocuments, deleteEntry } from './Storage';
import { formatFilename } from './functions';
import { allDocs } from '../Types';
import { documents } from './documents';

const uploadedDocsContainer = document.querySelector('#uploaded-docs-content');
const sampleDocsContainer = document.querySelector('#sample-docs-content');
const openButton: HTMLButtonElement = document.querySelector('#open-doc');
const deleteButton: HTMLButtonElement = document.querySelector('#remove-doc');

let metaKeyIsPressed = false;
let shiftKeyIsPressed = false;

// Gets user selected document tile elements
function getSelectionTiles() {
  return Array.from(document.querySelectorAll('.document-entry.selected'));
}

// gets user selected filenames 
function getSelectionFilenames() {
  return getSelectionTiles().map((doc) => doc.querySelector('.filename-text').getAttribute('value'));
}

// Open editor tab
function openEditorTab(filename: string, isUploaded: boolean) {
  const params = (isUploaded)
    ? { storage: filename }
    : { manifest: filename };
  const query = makeQuery(params);
  window.open(`./editor.html?${query}`, '_blank');
}

// Opens editor tab given a document tile element
function openTile(doc: Element) {
  const isUploaded = (doc.classList.contains('uploaded-doc')) ? true : false;
  const filename = doc.querySelector('.filename-text').getAttribute('value');
  openEditorTab(filename, isUploaded);
  loseFocus(doc);
}

function makeQuery(obj): string {
  return Object.keys(obj).map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
  }).join('&');
}

function loseFocus(tile: Element) {
  tile.classList.remove('selected');
}

function loseFocusAll() {
  Array.from(document.querySelectorAll('.document-entry.selected'))
    .forEach((doc) => loseFocus(doc));
  disableSidebarActions();
}

function disableSidebarActions() {
  openButton.classList.remove('active');
  deleteButton.classList.remove('active');
}

function enableSideBarActions() {
  openButton.classList.add('active');
  deleteButton.classList.add('active');
}

async function fetchUploadedDocuments(): Promise<string[]> {
  return await getAllDocuments()
    .then( (res: allDocs) => {
      return res.rows.map( row => row.key);
    })
    .catch(err => {
      console.log('Could\'nt fetch uploaded documents', err.message);
      return [];
    });
}

async function fetchSampleDocuments(): Promise<string[]> {
  return documents;
}

export async function updateDocumentSelector(): Promise<void> {
  const openButton: HTMLButtonElement = document.querySelector('#open-doc');
  const deleteButton: HTMLButtonElement = document.querySelector('#remove-doc');

  // load user-uploaded docs
  uploadedDocsContainer.innerHTML = '';

  const uploadedDocs = await fetchUploadedDocuments();
  uploadedDocs.sort();

  if (uploadedDocs.length === 0) {
    const doc = document.createElement('div');
    //doc.classList.add('document-entry');
    doc.id = 'no-docs-msg';
    doc.innerHTML = 'No Documents Uploaded';
    uploadedDocsContainer.appendChild(doc);
  } 
  else uploadedDocs.forEach(filename => {
    const doc = document.createElement('div');
    doc.classList.add('document-entry');
    doc.classList.add('uploaded-doc');

    const name = document.createElement('div');
    name.classList.add('filename-text');
    name.setAttribute('value', filename);
    name.innerHTML = formatFilename(filename, 25);
    doc.appendChild(name);

    // const input = document.createElement('input');
    // input.classList.add('doc-multiselect-btn');
    // input.setAttribute('type', 'checkbox');
    // name.appendChild(input);

    uploadedDocsContainer.appendChild(doc);
  });

  // load sample docs
  sampleDocsContainer.innerHTML = '';

  const sampleDocs = await fetchSampleDocuments();
  sampleDocs.sort();
  
  if (sampleDocs.length === 0) {
    const doc = document.createElement('div');
    doc.innerHTML = 'No Documents Uploaded';
    sampleDocsContainer.appendChild(doc);
  } 
  else sampleDocs.forEach(filename => {
    const doc = document.createElement('div');
    doc.classList.add('document-entry');

    const name = document.createElement('div');
    name.classList.add('filename-text');
    name.setAttribute('value', filename);
    name.innerHTML = formatFilename(filename, 25);
    doc.appendChild(name);

    sampleDocsContainer.appendChild(doc);
  });


  // add onclick event listener to docs
  Array.from(document.querySelectorAll('.document-entry')).forEach((doc) => {
    // double click event immediately opens document
    doc.addEventListener('dblclick', function() {
      getSelectionTiles().forEach(tile => openTile(tile));
    });

    // single click selects document or adds document to existing selection
    doc.addEventListener('click', function(e) {
      // No Shift or Meta pressed 
      if (!metaKeyIsPressed && !shiftKeyIsPressed) {
        // Tile is already selected -> No change
        if (doc.classList.contains('selected')) {
          Array.from(document.querySelectorAll('.document-entry.selected'))
            .forEach((doc) => loseFocus(doc));
          doc.classList.add('selected');
        }
        // Tile is not selected -> Clear selection and select tile
        else {
          Array.from(document.querySelectorAll('.document-entry.selected'))
            .forEach((doc) => loseFocus(doc));
          doc.classList.add('selected');
        }
      }
      // Meta key pressed (default behaviour if both meta and shift are pressed)
      else if (metaKeyIsPressed) {
        if (doc.classList.contains('selected')) {
          // do nothing
        }
        // Tile is not selected -> Add to selection
        else {
          doc.classList.add('selected');
        }
      }
      // WIP
      // else if (shiftKeyIsPressed) {
      // foobar
      // }

      // Check if there are any tiles selected
      if (getSelectionTiles().length === 0) {
        disableSidebarActions();
      }
      else {
        enableSideBarActions();
      }
    });
  });
}

export const InitDocumentSelector = (): void => {

  function handleOpenDocuments() {
    getSelectionTiles().forEach(tile => {
      openTile(tile);
    });
    disableSidebarActions();
  }

  function handleDeleteDocuments() {
    const filenames = getSelectionFilenames();
    const filenameFormatted = filenames.join('\n');
    const alertMessage = 'Are you sure you want to delete:\n' + filenameFormatted + '\n\nThis action is irreversible';
    const isConfirmed = window.confirm(alertMessage);
    
    if (isConfirmed) {
      const promises = filenames.map(filename => deleteEntry(filename));
      Promise.all(promises)
        .then( () => {
          updateDocumentSelector();
        })
        .catch( err => console.debug('failed to delete files: ', err));
      
      disableSidebarActions();
    }
  }
  
  openButton!.addEventListener('click', handleOpenDocuments);
  deleteButton!.addEventListener('click', handleDeleteDocuments);

  window.addEventListener('keydown', (e) => {
    if (e.metaKey) metaKeyIsPressed = true;
    if (e.shiftKey) shiftKeyIsPressed = true;
    // Lose focus on esc key
    if (e.key === 'Escape') {
      Array.from(document.querySelectorAll('.document-entry.selected'))
        .forEach((doc) => loseFocus(doc));
      disableSidebarActions();
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
    if ( !['document-entry', 'filename-text']
          .some(className => classList.contains(className)) 
    ) loseFocusAll();
  });

  updateDocumentSelector();
};