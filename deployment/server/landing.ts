import { InitSelectDocuments } from './landing/SelectDocuments';
import InitialUploadArea from './landing/InitialUploadArea';
// import FileManager from './landing/FileManager';
// import { createManifest, addEntry } from './landing/storage';
// import UploadManager from './landing/UploadManager';

const select = id => document.getElementById(id);

InitSelectDocuments();

select('initial_upload_container').appendChild(InitialUploadArea());

// function test_upload() {
//   const mei: File = (select('mei_upload') as HTMLInputElement).files[0];
//   const image: File = (select('image_upload') as HTMLInputElement).files[0];

//   if (mei === undefined || image === undefined) return;

//   createManifest(mei, image).then(manifest => {
//     const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/ld+json' });
//     return addEntry(mei.name, manifestBlob, true);
//   }).then( _ => {
//     updateDocumentSelector();
//   }).catch(err => {
//     console.error(err);
//   });
// }
// select('test_upload').addEventListener('click', test_upload);
