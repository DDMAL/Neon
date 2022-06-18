import { InitSelectDocuments } from './landing/SelectDocuments';
import InitialUploadArea from './landing/InitialUploadArea';
import { handleMakePair } from './landing/UploadManager';
import FileManager from './landing/FileManager';
// import { createManifest, addEntry } from './landing/storage';
// import UploadManager from './landing/UploadManager';

InitSelectDocuments();

document.getElementById('initial_upload_container').appendChild(InitialUploadArea()); // add to html instead of making in initialUploadArea
// add function to pairing button
document.getElementById('make_pair').addEventListener('click', handleMakePair);



const fm = FileManager.getInstance();
const foobar = document.createElement('button');
foobar.innerText = 'PRINT ALL FILES';
foobar.addEventListener('click', () => {
  fm.print();
  console.log('printed');
});
document.getElementById('right_col').appendChild(foobar);
