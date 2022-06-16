import { v4 as uuidv4 } from 'uuid';
import FileManager from './FileManager';
import { formatFilename } from './functions';

const mei = document.getElementById('mei_list');
const images = document.getElementById('image_list');
const paired = document.getElementById('paired_list');
const manuscripts = document.getElementById('manuscript_list');

const fm = FileManager.getInstance();

/**
 * Appends list element to unpaired containers and adds file to filemanager
 * @param files 
 * @returns rejected files array
 */
export function addNewFiles(files: File[]): File[] {
  const makeAndAppendElement = (file: File, type: string, container: HTMLElement) => {
    const unpairedElement = createUnpairedElement(file.name, type);
    container.appendChild(unpairedElement);
    fm.addFile(file);
  };

  const rejectFiles: File[] = [];
  files.forEach( file => {
    const ext = file.name.split('.').pop();

    if (ext === 'mei') 
      makeAndAppendElement(file, 'mei', mei);
    else if (['png','jpg','jpeg'].includes(ext)) 
      makeAndAppendElement(file, 'image', images);
    else if (ext === 'jsonld') {}
    else {
      console.log(`Unknown file type for: ${file.name}`);
      rejectFiles.push(file);
    }
  });
  return rejectFiles;
} 

/**
 * @param filename 
 * @param radioName radio group type
 * @returns unpaired mei or image list element
 */
function createUnpairedElement(filename: string, group: string): HTMLDivElement {
  if (group !== 'mei' && group !== 'image') return;
  const radioName = 'mei' ? 'mei_radio_group' : 'image_radio_group';
  const id = uuidv4();

  const radioContainer = document.createElement('div');
  radioContainer.className = 'radio_container';

  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.className = 'unpaired_item';
  radio.name = radioName;
  radio.value = filename;
  radio.id = id;

  const label = document.createElement('label');
  label.className = 'list_label';
  label.setAttribute('for', id);
  label.innerText = formatFilename(filename, 30);

  radioContainer.appendChild(radio);
  radioContainer.appendChild(label);
  return radioContainer;
}

function handleMakePair() {
  const selectedMeiElement = document.querySelector('input[name="mei_radio_group"]:checked') as HTMLInputElement;
  const selectedImageElement = document.querySelector('input[name="image_radio_group"]:checked') as HTMLInputElement;
  const mei_filename = selectedMeiElement.value;
  const image_filename = selectedImageElement.value;
}