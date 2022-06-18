import { v4 as uuidv4 } from 'uuid';
import FileManager from './FileManager';
import { formatFilename } from './functions';
import { createManifest, addEntry } from './storage';

const mei_container = document.getElementById('mei_list');
const image_container = document.getElementById('image_list');
const paired_container = document.getElementById('paired_list');
const manuscript_container = document.getElementById('manuscript_list');

const fm = FileManager.getInstance();

export function addNewFiles( files: File[] ): File[] {

  const rejectFiles: File[] = [];
  files.forEach( file => {
    const ext = file.name.split('.').pop();

    if ( ext === 'mei' ) {
      const unpairedItem = createUnpairedItem(file.name, 'mei');
      mei_container.appendChild(unpairedItem);
      fm.addFile(file);
    }
    else if ( ['png','jpg','jpeg'].includes(ext) ) {
      const unpairedItem = createUnpairedItem(file.name, 'image');
      image_container.appendChild(unpairedItem);
      fm.addFile(file);
    }
    else if ( ext === 'jsonld' ) {
      const manuscriptTile = createManuscriptTile(file.name);
      manuscript_container.appendChild(manuscriptTile);
      fm.addFile(file);
    }
    else {
      console.log(`Unknown file type for: ${file.name}`);
      rejectFiles.push(file);
    }
  });
  return rejectFiles;
} 

export function handleMakePair(): void {
  const selectedMeiElement = document.querySelector('input[name="mei_radio_group"]:checked') as HTMLInputElement;
  const selectedImageElement = document.querySelector('input[name="image_radio_group"]:checked') as HTMLInputElement;
  
  const mei_filename = selectedMeiElement.value;
  const image_filename = selectedImageElement.value;
  if (mei_filename === undefined || image_filename === undefined) return;
  
  const paired_el = createPairedTile(mei_filename, image_filename);
  paired_container.appendChild(paired_el);
  selectedMeiElement.parentElement.remove();
  selectedImageElement.parentElement.remove();
}

function createUnpairedItem(filename: string, group: string): HTMLDivElement {
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

function createPairedTile(mei_filename: string, image_filename: string): HTMLDivElement {
  const node = document.createElement('div');
  node.className = 'tile_item';
  node.setAttribute('mei', mei_filename);
  node.setAttribute('image', image_filename);
  node.innerText = formatFilename(mei_filename, 20);


  const deleteButton = document.createElement('button');
  deleteButton.innerText = '⌫';
  deleteButton.className = 'delete_button';
  deleteButton.addEventListener('click', () => {
    node.remove();
    // add items back to unpaired containers
    const meiItem = createUnpairedItem(mei_filename, 'mei');
    mei_container.appendChild(meiItem);
    const imageItem = createUnpairedItem(image_filename, 'image');
    image_container.appendChild(imageItem);
  });
  node.appendChild(deleteButton);

  return node;
}

function createManuscriptTile( filename: string ) {
  const tile = document.createElement('div');
  tile.className = 'tile_item';
  tile.setAttribute('value', filename);
  tile.innerText = formatFilename(filename, 20);


  const deleteButton = document.createElement('button');
  deleteButton.innerText = '⌫';
  deleteButton.className = 'delete_button';
  deleteButton.addEventListener('click', () => {
    tile.remove();
    fm.removeFile(filename);
  });
  tile.appendChild(deleteButton);

  return tile;
}