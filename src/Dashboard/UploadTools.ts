import { v4 as uuidv4 } from 'uuid';
import UploadFileManager from './UploadFileManager';
import { createManifest, addDocument } from './Storage';
import { IFolder, FileSystemTools } from './FileSystem';

const fm = UploadFileManager.getInstance();

// Set MEI template
const templatePath = 'samples/mei/mei_template.mei';
fm.setMeiTemplate(templatePath);

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
  text.innerText = formatFilename(filename, 50);
  text.setAttribute('style', 'margin-top: auto; margin-left: 3px;');

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
  
  let mei_filename = selectedMeiElement.value;
  const image_filename = selectedImageElement.value;
  let isCreated = false;

  if (selectedMeiElement.value === 'create_mei'){
    isCreated = true;
    // Change extension
    const fn = image_filename.split('.');
    if (fn.length > 1) {
      fn.pop();
    }
    fn.push('mei');

    mei_filename = fn.join('.');
    // Create new MEI file
    fm.getImgDimension(image_filename)
      .then((dimensions) => {
        const { width, height } = dimensions;
        const newMeiFile = fm.createMeiFile(mei_filename, width, height);
        fm.addFile(newMeiFile);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
  const filename = mei_filename.substring(0, mei_filename.length-4);
  // make and append UI element
  const paired_el = createPairedFolio(filename, mei_filename, image_filename);
  paired_container.appendChild(paired_el);
  // reflect in file manager
  fm.addFolio(filename, mei_filename, image_filename, isCreated);
  // remove from unpaired mei and image lists
  if (!isCreated) selectedMeiElement.parentElement.parentElement.remove();
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
  folio_filename.innerHTML = formatFilename(filename, 50);
  folio.appendChild(folio_filename); 

  function handleUnpair() {
    // remove folio from UI
    folio.remove();
    // remove folio from file manager
    const isCreated = fm.isCreatedFolio(filename);
    fm.removeFolio(filename);
    // add items back to unpaired containers
    if (!isCreated) {
      const meiItem = createUnpairedItem(mei_filename, 'mei');
      mei_container.appendChild(meiItem);
    }
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

export async function handleUploadAllDocuments(currentFolder: IFolder): Promise<unknown> {
  const folioPromises = fm.getFolios()
    .map( async ([name, mei, image]: [string, File, File]) => {
      const id = uuidv4();
      return await uploadFolio(id, name, mei, image, currentFolder);
    });
  
  const manuscriptPromises = []; //fm.getManuscripts()
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
  const newName = fnConflictHandler(name, FileSystemTools.getAllNames(currentFolder));
  return createManifest(id, newName, mei, image)
    .then(manifest => {
      const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/ld+json' });
      const isSingle = true;
      return addDocument(id, newName, manifestBlob, isSingle);
    })
    // add to dashboard FileSystem
    .then(succeeded => {
      if (succeeded) {
        const datetime = new Date().toLocaleString();
        const fileEntry = FileSystemTools.createFile(newName, id);
        const folioEntry = FileSystemTools.addMetadata(fileEntry, { type: 'folio', created_on: datetime });
        const isAdded = FileSystemTools.addEntry(folioEntry, currentFolder);
        return isAdded;
      }
      else {
        console.log('failed to uploadFolio: ' + name);
        return false;
      }
    });
}

// async function uploadManuscript(manuscript: File): Promise<boolean> {
//   return addEntry(manuscript.name, manuscript, false);
// }

export async function sortFileByName(sortByNameBtn: Element): Promise<void>  {
  const fileList = sortByNameBtn.parentElement.nextElementSibling;
  const fileElements = Array.from(fileList.children);
  
  let isAscending = sortByNameBtn.classList.contains('arrow-up');

  if (isAscending) {
    sortByNameBtn.classList.remove('arrow-up');
    sortByNameBtn.classList.add('arrow-down');
    sortByNameBtn.innerHTML = '&#x22C1;';
  } else {
    sortByNameBtn.classList.remove('arrow-down');
    sortByNameBtn.classList.add('arrow-up');
    sortByNameBtn.innerHTML = '&#x22C0;';
  }

  isAscending = !isAscending;

  fileElements.sort((a, b) => {
    const nameA = a.textContent.trim();
    const nameB = b.textContent.trim();
    return isAscending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  fileElements.forEach(element => {
    fileList.appendChild(element);
  });

  sortByNameBtn.setAttribute('style', 'color: black');
}

// async function uploadManuscript(manuscript: File, currentFolder: IFolder, existingNames: string[]): Promise<boolean> {
//   const isSingle = false;
//   const id = manuscript['@id'] !== null ? manuscript['@id'] : manuscript.name;
//   return addEntry(id, manuscript.name, manuscript, isSingle)
//     // add to dashboard FileSystem
//     .then(succeeded => {
//       if (succeeded) {
//         const newName = fnConflictHandler(manuscript.name, existingNames);
//         const datetime = new Date().toLocaleString();
//         const fileEntry = FileSystemTools.createFile(newName, id);
//         const manuscriptEntry = FileSystemTools.addMetadata(fileEntry, { type: 'manuscript', created_on: datetime });
//         const isAdded = FileSystemTools.addEntry(manuscriptEntry, currentFolder);
//         return isAdded;
//       }
//       else {
//         console.log('failed to uploadFolio: ' + name);
//         return false;
//       }
//     });
// }

// Limit filename length
export function formatFilename(filename: string, maxLen: number): string {
  const chunkLen = Math.floor(maxLen/2);
  const len = filename.length;
  if (len <= maxLen) return filename;
  else return `${filename.substring(0,chunkLen-1)}...${filename.substring(len-chunkLen+2, len)}`;
}

// Renames file if there are naming conflicts, in the form of 'foobar (1)'
export function fnConflictHandler(filename: string, existingNames: string[]): string {
  let newFilename = filename;
  let counter = 1;

  while (existingNames.includes(newFilename)) {
    newFilename = `${filename}(${counter})`;
    counter++;
  }
  return newFilename;
}