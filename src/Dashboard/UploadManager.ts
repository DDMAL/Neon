import { v4 as uuidv4 } from 'uuid';
import FileManager from './FileManager';
import { formatFilename, renameFile } from './functions';
import { createManifest, addEntry, fetchSampleDocuments, fetchUploadedDocuments } from './Storage';

const fm = FileManager.getInstance();

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
      // const manuscriptFolio = createManuscriptFolio(file.name);
      // manuscript_container.appendChild(manuscriptFolio);
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
  text.setAttribute('style', 'margin-top: auto');

  const delBtn = document.createElement('img');
  delBtn.className = 'unpaired_del_btn';
  delBtn.src = `${__ASSET_PREFIX__}assets/img/unpaired-remove-doc.svg`;
  delBtn.title = 'delete';

  label.appendChild(radio);
  label.appendChild(text);
  node.appendChild(label);
  node.appendChild(delBtn);

  delBtn.addEventListener('click', function() {
    node.remove();
  });

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
  const paired_el = createPairedFolio(filename, mei_filename, image_filename);
  paired_container.appendChild(paired_el);
  // reflect in file manager
  fm.addFolio(filename, mei_filename, image_filename);
  // remove from unpaired mei and image lists
  selectedMeiElement.parentElement.parentElement.remove();
  selectedImageElement.parentElement.parentElement.remove();
}

function createPairedFolio(filename: string, mei_filename: string, image_filename: string): HTMLDivElement {
  const mei_container: HTMLDivElement = document.querySelector('#mei_list');
  const image_container: HTMLDivElement = document.querySelector('#image_list');

  const folio = document.createElement('div');
  folio.className = 'folio_item';
  folio.setAttribute('mei', mei_filename);
  folio.setAttribute('image', image_filename);

  const folio_filename = document.createElement('div');
  folio_filename.classList.add('folio-filename');
  folio_filename.innerHTML = formatFilename(filename, 25);
  folio.appendChild(folio_filename); 

  function handleUnpair() {
    // remove folio from UI
    folio.remove();
    // remove folio from file manager
    fm.removeFolio(filename);
    // add items back to unpaired containers
    const meiItem = createUnpairedItem(mei_filename, 'mei');
    mei_container.appendChild(meiItem);
    const imageItem = createUnpairedItem(image_filename, 'image');
    image_container.appendChild(imageItem);
  }

  const unpairBtn = document.createElement('img');
  unpairBtn.className = 'unpair_btn';
  unpairBtn.src = `${__ASSET_PREFIX__}assets/img/unpair-doc.svg`;
  unpairBtn.title = 'unpair';
  unpairBtn.addEventListener('click', handleUnpair);
  folio.appendChild(unpairBtn);

  return folio;
}

export async function handleUploadAllDocuments(): Promise<any> {
  const uploads = await fetchUploadedDocuments();
  const samples = fetchSampleDocuments();
  const existingNames = uploads.concat(samples);

  const folioPromises = fm.getFolios()
    .map( async ([name, mei, image]: [string, File, File]) => {
      const newName = renameFile(name, existingNames);
      existingNames.push(newName);
      return await uploadFolio(newName, mei, image)
    });
  
  fm.clear();

  const promises = 
    folioPromises
      .map(p => 
        Promise.resolve(p)
          .then(value => ({ status: 'fulfilled', value }),
                reason => ({ status: 'rejected', reason })
          )
      );
  
  return Promise.all(promises);
}

async function uploadFolio(name: string, mei: File, image: File): Promise<boolean> {
  return createManifest(name, mei, image)
    .then(manifest => {
      const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/ld+json' });
      return addEntry(name, manifestBlob, true);
    });
}

// async function uploadManuscript(manuscript: File): Promise<boolean> {
//   return addEntry(manuscript.name, manuscript, false);
// }