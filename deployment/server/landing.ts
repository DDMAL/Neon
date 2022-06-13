import { InitSelectDocuments } from './landing/SelectDocuments';
import InitialUploadArea from './landing/InitialUploadArea';
import UnmatchedFilesArea from './landing/UnmatchedFilesArea';
import FileManager from './landing/FileManager';
import { getAllDocuments, createManifest, addEntry } from './landing/storage';
console.log('start');

const select = id => document.getElementById(id);
const fm = FileManager.getInstance();

getAllDocuments()
  .then(res => console.log('resolved: ', res))
  .catch(err => console.log('unresolved: ', err));
const faux_folios = ['005r_pre-toggle.jsonld', 'CH-E_611_046r.jsonld'];

InitSelectDocuments(faux_folios, []);
select('initial_upload_container').appendChild(InitialUploadArea());
select('upload_container').appendChild(UnmatchedFilesArea());


// // print for debug state
// const btn = document.createElement('button');
// btn.addEventListener('click', () => fm.print());
// btn.innerHTML = 'PRINT';
// select('initial_upload_container').appendChild

function test_upload() {
  const mei: File = (select('mei_upload') as HTMLInputElement).files[0];
  const image: File = (select('image_upload') as HTMLInputElement).files[0];

  console.log('test_upload(): ', mei, image); //
  if (mei === undefined || image === undefined) return;
  createManifest(mei, image).then(manifest => {
    console.log('mainfest: ', manifest); //
    const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/ld+json' });
    return addEntry(mei.name, manifestBlob, true);
  }).then(_ => {
    // window.location.reload();
    console.log('finished upload');
  }).catch(err => {
    console.error(err);
  });
}

select('test_upload').addEventListener('click', test_upload);


console.log('end');
