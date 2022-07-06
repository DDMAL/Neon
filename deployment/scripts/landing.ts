import { InitSelectDocuments, updateDocumentSelector } from '../../src/LandingPage/SelectDocuments';
import { handleMakePair, handleUploadAllDocuments } from '../../src/LandingPage/UploadManager';
import { InitUploadArea } from '../../src/LandingPage/UploadArea';
import FileManager from '../../src/LandingPage/FileManager';

InitSelectDocuments();
InitUploadArea();

// add function to pairing button
document.querySelector('#make_pair').addEventListener('click', handleMakePair);
document.querySelector('#upload_button').addEventListener('click', async () => {
  const circle = document.querySelector('#loading_circle');
  circle.className = 'loading';
  handleUploadAllDocuments()
    .then( (res) => {
      console.log('Upload results: ', res);
    })
    .catch( () => {
      console.log('One or more uploads rejected');
    })
    .finally( () => {
      updateAndClear();
      circle.className = '';
    });
});

function updateAndClear() {
  updateDocumentSelector().then( () => {
    document.querySelector('#paired_list').innerHTML = '';
    document.querySelector('#manuscript_list').innerHTML = '';
    fm.clearFolios();
    fm.clearManuscripts();
  });
}


// to see behind the scenes: to-be-removed
const fm = FileManager.getInstance();
const foobar = document.createElement('button');
foobar.innerText = 'PRINT ALL FILES';
foobar.addEventListener('click', () => {
  fm.print();
});
document.querySelector('#right_col').appendChild(foobar);
