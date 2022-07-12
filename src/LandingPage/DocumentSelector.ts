import { getAllDocuments, deleteEntry } from './storage';
import { formatFilename } from './functions';
import { allDocs } from '../Types';
import { documents } from './documents';

const dropdown: HTMLSelectElement = document.querySelector('#documents_dropdown');
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
  dropdown.innerHTML = '';
  const isUploaded = dropdown.className === selectionType.uploaded;
  const func = isUploaded ? fetchUploadedDocuments : fetchSampleDocuments;

  const documents = await func();
  documents.sort();

  if (documents.length === 0) {
    const option = document.createElement('option');
    option.label = 'No Documents Uploaded';
    option.disabled = true;
    dropdown.appendChild(option);
  } 
  else documents.forEach(filename => {
    const option = document.createElement('option');
    option.value = filename;
    const name = filename.split('.')[0];
    option.innerText = formatFilename(name, 25);
    dropdown.appendChild(option);
  });
}

export const InitDocumentSelector = (): void => {
  const sampleButton: HTMLButtonElement = document.querySelector('#sample_selection');
  const uploadedButton: HTMLButtonElement = document.querySelector('#uploaded_selection');

  const openButton: HTMLButtonElement = document.querySelector('#open_documents');
  const deleteButton: HTMLButtonElement = document.querySelector('#delete_documents');

  function changeSelectionTo(selection: selectionType): void {
    if (dropdown.className === selection) return;
    else {
      dropdown.className = selection;
    }
    updateDocumentSelector();
    if (selection === selectionType.sample) {
      deleteButton.disabled = true;
    }
    else {
      deleteButton.disabled = false;
    }
  }

  sampleButton.addEventListener('click', () => changeSelectionTo(selectionType.sample));
  uploadedButton.addEventListener('click', () => changeSelectionTo(selectionType.uploaded));

  function handleOpenDocuments() {
    getSelection().forEach(filename => openEditorTab(filename));
  }

  // gets user selected filenames 
  function getSelection() {
    const dropdown: HTMLSelectElement = document.querySelector('#documents_dropdown');
    return [...dropdown.options]
      .filter(option => option.selected)
      .map(option => option.value);
  }

  function openEditorTab(filename: string) {
    const isUploaded = dropdown.className === 'uploaded';
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
    const filenameFormatted = getSelection().map(name => `- ${name}`).join('\n');
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
  
  openButton.addEventListener('click', handleOpenDocuments);
  deleteButton.addEventListener('click', handleDeleteDocuments);
  updateDocumentSelector();
};