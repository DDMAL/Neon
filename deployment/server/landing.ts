import { InitSelectDocuments } from './landing/SelectDocuments';
import InitialUploadArea from './landing/InitialUploadArea';
import UnmatchedFilesArea from './landing/UnmatchedFilesArea';
import FileManager from './landing/FileManager';
import { getAllDocuments } from './landing/storage';

const select = id => document.getElementById(id);

const fm = FileManager.getInstance();

getAllDocuments().then(res => {
  console.log(res);
});

InitSelectDocuments(['005r_pre-toggle.jsonld', 'CH-E_611_046r.jsonld'], []);
select('initial_upload_container').appendChild(InitialUploadArea());
select('upload_container').appendChild(UnmatchedFilesArea());


// print for debug state
// const btn = document.createElement('button');
// btn.addEventListener('click', () => fm.print());
// btn.innerHTML = 'PRINT';
// select('initial_upload_container').appendChi