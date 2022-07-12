import { getAllDocuments, deleteEntry } from './storage';
import { formatFilename } from './functions';
import { allDocs } from '../Types';
import { documents } from './documents';
import { selectedDocs} from '../../deployment/scripts/dashboard';

const uploadedDocsContainer = document.querySelector('#uploaded-docs-content');
const sampleDocsContainer = document.querySelector('#sample-docs-content');

let commandKeyIsPressed = false;
let shiftKeyIsPressed = false;

enum selectionType {
  uploaded = 'uploaded',
  sample = 'sample'
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

  // load user-uploaded docs
  uploadedDocsContainer.innerHTML = '';

  const uploadedDocs = await fetchUploadedDocuments();
  uploadedDocs.sort();

  if (uploadedDocs.length === 0) {
    const doc = document.createElement('div');
    //doc.classList.add('document-entry');
    doc.innerHTML = 'No Documents Uploaded';
    uploadedDocsContainer.appendChild(doc);
  } 
  else uploadedDocs.forEach(filename => {
    const doc = document.createElement('div');
    doc.classList.add('document-entry');
    doc.classList.add('uploaded-doc');

    const name = document.createElement('div');
    name.classList.add('filename-text');
    name.innerHTML = formatFilename(filename.split('.')[0], 25);
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
    doc.classList.add('document-entry');
    doc.classList.add('sample-doc');
    doc.innerHTML = 'No Documents Uploaded';
    sampleDocsContainer.appendChild(doc);
  } 
  else sampleDocs.forEach(filename => {
    const doc = document.createElement('div');
    doc.classList.add('document-entry');

    const name = document.createElement('div');
    name.classList.add('filename-text');
    name.innerHTML = formatFilename(filename.split('.')[0], 25);
    doc.appendChild(name);

    sampleDocsContainer.appendChild(doc);
  });


  // add onclick event listener to docs
  Array.from(document.querySelectorAll('.document-entry')).forEach((doc) => {
    doc.addEventListener('click', function(e) {
      
      if (doc.classList.contains('selected')) {
        doc.classList.remove('selected');
        for (let i=0; i<selectedDocs.length; i++) {
          const tempDoc = selectedDocs[i];
          if (doc.isSameNode(tempDoc)) selectedDocs.splice(i, i+1);
        }
      }
      else {
        // check if meta or control key is pressed to decide whether or not to clear curr selection
        if (!commandKeyIsPressed && !shiftKeyIsPressed) {
          Array.from(document.querySelectorAll('.document-entry.selected')).forEach((doc) => {
            doc.classList.remove('selected');
          });
          selectedDocs.length = 0;
        }

        doc.classList.add('selected');
        selectedDocs.push(doc);
      }

      if (selectedDocs.length !== 0) {
        Array.from(document.querySelectorAll('.action-bar-item-container')).forEach((item) => {
          item.classList.add('active');
        });
      }
      else {
        document.querySelector('#remove-doc').classList.remove('active');
        document.querySelector('#open-doc').classList.remove('active');
      }
    });
  }); 
}

export const InitDocumentSelector = (): void => {

  const openButton: HTMLButtonElement = document.querySelector('#open-doc');
  const deleteButton: HTMLButtonElement = document.querySelector('#remove-doc');

  function changeSelectionTo(selection: selectionType): void {
    if (uploadedDocsContainer.className === selection) return;
    else {
      uploadedDocsContainer.className = selection;
    }
    updateDocumentSelector();
    if (selection === selectionType.sample) {
      deleteButton.disabled = true;
    }
    else {
      deleteButton.disabled = false;
    }
  }


  function handleOpenDocuments() {
    for (let i=0; i<selectedDocs.length; i++) {
      const doc = selectedDocs[i];
      const filename = doc.querySelector('.filename-text').innerText;
      const isUploaded = (doc.classList.contains('uploaded-doc'))? true : false;
      openEditorTab(`${filename}.mei`, isUploaded);
    }
    selectedDocs.length = 0;
    Array.from(document.querySelectorAll('.document-entry.elected'))
  }

  // gets user selected filenames 
  function getSelection() {
    const dropdown: HTMLSelectElement = document.querySelector('#documents_dropdown');
    return [...dropdown.options]
      .filter(option => option.selected)
      .map(option => option.value);
  }

  function openEditorTab(filename: string, isUploaded: boolean) {
    let params;
    if (isUploaded) params = { storage: filename };
    else params = { manifest: filename };
    const query = makeQuery(params);
    window.open(`./editor.html?${query}`, '_blank');
  }

  function makeQuery(obj): string {
    return Object.keys(obj).map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    }).join('&');
  }

  function handleDeleteDocuments() {
    const filenameFormatted = selectedDocs.map(doc => `- ${doc.querySelector('.filename-text').innerText}`).join('\n');
    const alertMessage = 'Are you sure you want to delete:\n' + filenameFormatted + '\n\nThis action is irreversible';
    const isConfirmed = window.confirm(alertMessage);
    
    if (isConfirmed) {
      const promises = getSelection().map(filename => deleteEntry(filename));
      Promise.all(promises)
        .then( () => {
          updateDocumentSelector();
        })
        .catch( err => console.debug('failed to delete files: ', err));
    }
  }
  
  openButton?.addEventListener('click', handleOpenDocuments);
  deleteButton?.addEventListener('click', handleDeleteDocuments);

  window.addEventListener('keydown', (e) => {
    if (e.metaKey) commandKeyIsPressed = true;
    if (e.shiftKey) shiftKeyIsPressed = true;
    if (e.key === "Escape") {
      Array.from(document.querySelectorAll('.document-entry.selected')).forEach((doc) => {
        doc.classList.remove('selected');
      });
      selectedDocs.length = 0;
      document.querySelector('#remove-doc').classList.remove('active');
      document.querySelector('#open-doc').classList.remove('active');
    }
  });

  window.addEventListener('keyup', (e) => {
    if (!e.metaKey) commandKeyIsPressed = false;
    if (!e.shiftKey) shiftKeyIsPressed = false;
  });

  updateDocumentSelector();
};