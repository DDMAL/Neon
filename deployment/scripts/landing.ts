import { InitDocumentSelector, updateDocumentSelector } from '../../src/LandingPage/DocumentSelector';
import { handleMakePair, handleUploadAllDocuments } from '../../src/LandingPage/UploadManager';
import { InitUploadArea } from '../../src/LandingPage/uploadArea';
import FileManager from '../../src/LandingPage/FileManager';

const fm = FileManager.getInstance();

InitDocumentSelector();
InitUploadArea();

// add function to pairing button
document.querySelector('#make_pair')!.addEventListener('click', handleMakePair);
document.querySelector('#upload_button')!.addEventListener('click', async () => {
  const circle = document.querySelector('#loading_circle')!;
  circle.className = 'loading';
  handleUploadAllDocuments()
    .then( (res) => {
      console.log('Upload results: ', res);
      updateAndClear();
      circle.className = '';
    })
    .catch( (err) => {
      console.log('One or more uploads rejected: ', err);
      updateAndClear();
      circle.className = '';
    });
});

async function updateAndClear() {
  updateDocumentSelector().then( () => {
    document.querySelector('#paired_list')!.innerHTML = '';
    document.querySelector('#manuscript_list')!.innerHTML = '';
    fm.clearFolios();
    fm.clearManuscripts();
  });
}

