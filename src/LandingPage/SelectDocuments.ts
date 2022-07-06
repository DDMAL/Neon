import { getAllDocuments, deleteEntry } from './storage';
import { formatFilename } from './functions';
import { allDocs } from '../Types';

async function fetchDocuments(): Promise<string[][]> {
  return await getAllDocuments()
    .then( (res: allDocs) => {
      const pages: string[] = [];
      const manuscripts: string[] = [];
      res.rows.forEach( row => {
        if (row.doc.kind === 'page') { 
          pages.push(row.key); 
        }
        else if (row.doc.kind === 'manuscript') {
          manuscripts.push(row.key);
        }
        else { 
          console.log('file type/kind did not match page or manuscript: ', row);
        }
      });
      return [pages, manuscripts];
    })
    .catch(err => {
      console.log(err);
      return [[],[]];
    });
}

export async function updateDocumentSelector(): Promise<void> {
  const allDocuments = await fetchDocuments();
  const folioNames = allDocuments[0].sort();
  const manuscriptNames = allDocuments[1].sort();

  const folioGroup = document.getElementById('uploaded_folios') as HTMLOptGroupElement;
  const manuscriptGroup = document.getElementById('uploaded_manuscripts') as HTMLOptGroupElement;
  
  folioGroup.innerHTML = '';
  manuscriptGroup.innerHTML = '';

  if (folioNames.length === 0) {
    folioGroup.label = 'No Folios Uploaded';
  } 
  else folioNames.forEach(name => {
    folioGroup.label = 'Folios: ';
    const option = document.createElement('option');
    option.value = name;
    option.innerText = formatFilename(name, 20);
    folioGroup.appendChild(option);
  });
  if (manuscriptNames.length === 0) {
    manuscriptGroup.label = 'No Manuscripts Uploaded';
  } 
  else manuscriptNames.forEach(name => {
    manuscriptGroup.label = 'Manuscripts: ';
    const option = document.createElement('option');
    option.value = name;
    option.innerText = formatFilename(name, 20);
    manuscriptGroup.appendChild(option);
  });
}

export const InitSelectDocuments = (): void => {

  function handleOpenDocuments() {
    getSelection().forEach(filename => openEditorTab(filename));
  }

  function getSelection() {
    const dropdown = document.getElementById('documents_dropdown') as HTMLSelectElement;
    return [...dropdown.options]
      .filter(option => option.selected)
      .map(option => option.value);
  }

  function openEditorTab(filename: string) {
    const params = makeParams({ storage: filename });
    window.open(`./editor.html?${params} `, '_blank');
  }

  function makeParams(obj): string {
    return Object.keys(obj).map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    }).join('&');
  }

  function handleDeleteDocuments() {
    const selection = getSelection();
    const filenameFormatted = selection.map(name => `- ${name}`).join('\n');
    const alertMessage = 'Are you sure you want to delete:\n' + filenameFormatted + '\n\nThis action is irreversible';
    const isConfirmed = window.confirm(alertMessage);
    
    if (isConfirmed) {
      const promises = selection.map(filename => deleteEntry(filename));
      Promise.all(promises)
        .then( () => {
          updateDocumentSelector();
        })
        .catch( err => console.debug('failed to delete files: ', err));
    }
  }
  
  updateDocumentSelector();

  const openButton = document.getElementById('open_documents');
  openButton.addEventListener('click', handleOpenDocuments);
  const deleteButton = document.getElementById('delete_documents');
  deleteButton.addEventListener('click', handleDeleteDocuments);
};