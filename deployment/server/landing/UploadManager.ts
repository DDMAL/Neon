import FileManager from './FileManager';

const mei = document.getElementById('mei_container');
const images = document.getElementById('images_container');
const paired = document.getElementById('paired_container');
const manuscripts = document.getElementById('manuscripts_container');

const fm = FileManager.getInstance();

export function addNewFiles(files: File[]): void {
  files.forEach( file => {
    fm.addFile(file);
    const ext = file.name.split('.').pop();
    // if (ext === 'mei') radioName;
    // else if (ext === 'jsonld');
  });
} 

function createUnpairedElement(file: File, radioName: string): HTMLInputElement {
  if (radioName !== 'mei' && radioName !== 'image') return;
  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.className = 'list_element';
  radio.name = radioName;
  radio.setAttribute('value', file.name);
  const label = document.createElement('label');
  label.className = 'list_label';
  label.innerText = file.name;
  radio.appendChild(label);
  return radio;
}

// function handleDeletePopUp


// export function deleteFile(el: HTMLElement): void {
// }

