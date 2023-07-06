import { v4 as uuidv4 } from 'uuid';
import UploadFileManager from './UploadFileManager';
import { createManifest, addEntry } from './Storage';
import { IFolder, fs_functions } from './FileSystem';

const fm = UploadFileManager.getInstance();

// Adds new files to upload pairing container and filemanager, returns list of rejected files
export function addNewFiles( files: File[] ): File[] {
  const mei_container: HTMLDivElement = document.querySelector('#mei_list');
  const image_container: HTMLDivElement = document.querySelector('#image_list');

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
      // // remove manuscript support for the immediate future!
      // const manuscriptTile = createManuscriptTile(file.name);
      // manuscript_container.appendChild(manuscriptTile);
      // fm.addFile(file);
      // fm.addManuscript(file.name);
    }
    else {
      rejectFiles.push(file);
    }
  });
  return rejectFiles;
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

  const text = document.createElement('span');
  text.innerText = formatFilename(filename, 28);

  label.appendChild(radio);
  label.appendChild(text);
  node.appendChild(label);
  return node;
}

export function handleMakePair(): void {
  const paired_container: HTMLDivElement = document.querySelector('#paired_list');

  // get and check if selected radio exists
  const selectedMeiElement: HTMLInputElement = document.querySelector('input[name="mei_radio_group"]:checked');
  const selectedImageElement: HTMLInputElement = document.querySelector('input[name="image_radio_group"]:checked');
  if (selectedMeiElement === null || selectedImageElement === null) return;
  
  const mei_filename = selectedMeiElement.value;
  const image_filename = selectedImageElement.value;
  const filename = mei_filename.substring(0, mei_filename.length-4);
  // make and append UI element
  const paired_el = createPairedTile(filename, mei_filename, image_filename);
  paired_container.appendChild(paired_el);
  // reflect in file manager
  fm.addFolio(filename, mei_filename, image_filename);
  // remove from unpaired mei and image lists
  selectedMeiElement.parentElement.parentElement.remove();
  selectedImageElement.parentElement.parentElement.remove();
}

function createPairedTile(filename: string, mei_filename: string, image_filename: string): HTMLDivElement {
  const mei_container: HTMLDivElement = document.querySelector('#mei_list');
  const image_container: HTMLDivElement = document.querySelector('#image_list');

  const tile = document.createElement('div');
  tile.className = 'tile_item';
  tile.setAttribute('mei', mei_filename);
  tile.setAttribute('image', image_filename);

  const tile_filename = document.createElement('div');
  tile_filename.classList.add('tile-filename');
  tile_filename.innerHTML = formatFilename(filename, 25);
  tile.appendChild(tile_filename); 

  function handleUnpair() {
    // remove tile from UI
    tile.remove();
    // remove folio from file manager
    fm.removeFolio(filename);
    // add items back to unpaired containers
    const meiItem = createUnpairedItem(mei_filename, 'mei');
    mei_container.appendChild(meiItem);
    const imageItem = createUnpairedItem(image_filename, 'image');
    image_container.appendChild(imageItem);
  }

  const deleteButton = document.createElement('button');
  deleteButton.innerText = '⌫';
  deleteButton.className = 'delete_button';
  deleteButton.addEventListener('click', handleUnpair);
  tile.appendChild(deleteButton);

  return tile;
}

export async function handleUploadAllDocuments(currentFolder: IFolder): Promise<any> {
  const folioPromises = fm.getFolios()
    .map( async ([name, mei, image]: [string, File, File]) => {
      const id = uuidv4()
      return await uploadFolio(id, name, mei, image, currentFolder);
    });
  
  const manuscriptPromises = [] //fm.getManuscripts()
  // .map( async (file: File) => {
  //   return await uploadManuscript(file);
  // });

  const promises = [...folioPromises, ...manuscriptPromises]
    .map(p => Promise.resolve(p)
      .then(value => ({ status: 'fulfilled', value }), reason => ({ status: 'rejected', reason }))
    );
  
  fm.clear();
  return Promise.all(promises);
}

async function uploadFolio(id: string, name: string, mei: File, image: File, currentFolder: IFolder): Promise<boolean> {
  return createManifest(id, name, mei, image)
    .then(manifest => {
      const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/ld+json' });
      const isSingle = true;
      return addEntry(id, name, manifestBlob, isSingle);
    })
    // add to dashboard FileSystem
    .then(succeeded => {
      if (succeeded) {
        const newName = renameFile(name, fs_functions.getAllNames(currentFolder));
        const datetime = new Date().toLocaleString();
        const fileEntry = fs_functions.createFile(newName, id);
        const folioEntry = fs_functions.addMetadata(fileEntry, { type: 'folio', created_on: datetime });
        const isAdded = fs_functions.addEntry(folioEntry, currentFolder);
        return isAdded;
      }
      else {
        console.log('failed to uploadFolio: ' + name);
        return false;
      }
    })
}

async function uploadManuscript(manuscript: File, currentFolder: IFolder, existingNames: string[]): Promise<boolean> {
  const isSingle = false;
  const id = manuscript['@id'] !== null ? manuscript['@id'] : manuscript.name;
  return addEntry(id, manuscript.name, manuscript, isSingle)
    // add to dashboard FileSystem
    .then(succeeded => {
      if (succeeded) {
        const newName = renameFile(manuscript.name, existingNames);
        const datetime = new Date().toLocaleString();
        const fileEntry = fs_functions.createFile(newName, id);
        const manuscriptEntry = fs_functions.addMetadata(fileEntry, { type: 'manuscript', created_on: datetime });
        const isAdded = fs_functions.addEntry(manuscriptEntry, currentFolder);
        return isAdded;
      }
      else {
        console.log('failed to uploadFolio: ' + name);
        return false;
      }
    })
}

export function formatFilename(filename: string, maxLen: number): string {
  const chunkLen = Math.floor(maxLen/2);
  const len = filename.length;
  if (len <= maxLen) return filename;
  else return `${filename.substring(0,chunkLen-1)}...${filename.substring(len-chunkLen+2, len)}`;
}

// Renames file if there are naming conflicts, in the form of 'foobar (1)'
export function renameFile(filename: string, comparisons: string[]): string {
  const reg = new RegExp(filename);
  const results = comparisons.filter((comparison: string) => reg.test(comparison));

  if (results.length !== 0) {
    // Find lowest digit to name
    const digitsReg = /\(\d+\),/g;
    const soup = results.join().concat(',');
    const digitsResults = soup.match(digitsReg);
    
    // If no digit matches then go to else statement
    if (digitsResults !== null) {
      const digits: number[] = digitsResults.map(str => {
        const stripped = str.substring(1, str.length-2);
        return Number(stripped);
      });
      digits.sort();

      const idx = digits.indexOf(1);
      if (idx === -1) return `${filename}(1)`;
      else {
        let prev = 1;
        for (let i = idx+1 ; i < digits.length ; i++) {
          const cur = digits[i];
          if (cur !== prev + 1) {
            break;
          }
          prev += 1;
        }
        return `${filename}(${prev+1})`;
      }
    }
    else return `${filename}(1)`;
  } 
  else return filename;
}