import { select } from 'd3';
import { v4 as uuidv4 } from 'uuid';
import FileManager from './FileManager';
import { formatFilename } from './functions';

const mei_container = document.getElementById('mei_list');
const image_container = document.getElementById('image_list');
const paired_container = document.getElementById('paired_list');
const manuscript_container = document.getElementById('manuscript_list');

const fm = FileManager.getInstance();

/**
 * Appends list element to unpaired containers and adds file to filemanager
 * @param files 
 * @returns rejected files array
 */
export function addNewFiles(files: File[]): File[] {

  const rejectFiles: File[] = [];
  files.forEach( file => {
    const ext = file.name.split('.').pop();

    if (ext === 'mei') {
      makeAndAppendUnpairedElement(file.name, 'mei', mei_container);
      fm.addFile(file);
    }
    else if (['png','jpg','jpeg'].includes(ext)) {
      makeAndAppendUnpairedElement(file.name, 'image', image_container);
      fm.addFile(file);
    }
    else if (ext === 'jsonld') {}
    else {
      console.log(`Unknown file type for: ${file.name}`);
      rejectFiles.push(file);
    }
  });
  return rejectFiles;
} 

const makeAndAppendUnpairedElement = (filename: string, type: string, container: HTMLElement) => {
  const unpairedElement = createUnpairedElement(filename, type);
  container.appendChild(unpairedElement);
};

/**
 * @param filename 
 * @param radioName radio group type, 'mei' or 'image' or 'manuscript'
 * @returns unpaired mei or image list element
 */
function createUnpairedElement(filename: string, group: string): HTMLDivElement {
  if (group !== 'mei' && group !== 'image') return;
  const radioName = 'mei' === group ? 'mei_radio_group' : 'image_radio_group';
  const id = uuidv4();

  const node = document.createElement('div');
  node.className = 'unpaired_item_container';

  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.className = 'unpaired_item_radio';
  radio.name = radioName;
  radio.value = filename;
  radio.id = id;

  const label = document.createElement('label');
  label.className = 'unpaired_item_label';
  label.setAttribute('for', id);
  label.innerText = formatFilename(filename, 35);

  node.appendChild(radio);
  node.appendChild(label);
  return node;
}

export function handleMakePair(): void {
  const selectedMeiElement = document.querySelector('input[name="mei_radio_group"]:checked') as HTMLInputElement;
  const selectedImageElement = document.querySelector('input[name="image_radio_group"]:checked') as HTMLInputElement;
  console.log(selectedMeiElement, selectedImageElement);
  
  const mei_filename = selectedMeiElement.value;
  const image_filename = selectedImageElement.value;
  if (mei_filename === undefined || image_filename === undefined) return;
  
  const paired_el = createPairedElement(mei_filename, image_filename);
  paired_container.appendChild(paired_el);
  selectedMeiElement.parentElement.remove();
  selectedImageElement.parentElement.remove();
}

function createPairedElement(mei_filename: string, image_filename: string): HTMLDivElement {
  const node = document.createElement('div');
  node.className = 'paired_item';
  node.setAttribute('mei', mei_filename);
  node.setAttribute('image', image_filename);
  node.innerText = formatFilename(mei_filename, 20);


  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'x';
  deleteButton.addEventListener('click', () => {
    node.remove();
    makeAndAppendUnpairedElement(mei_filename, 'mei', mei_container);
    makeAndAppendUnpairedElement(image_filename, 'image', image_container);
  });
  node.appendChild(deleteButton);

  return node;
}
