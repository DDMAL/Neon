import { InitSelectDocuments, updateDocumentSelector } from '../../src/LandingPage/selectDocuments';
import { handleMakePair, handleUploadAllDocuments } from '../../src/LandingPage/UploadManager';
import { InitUploadArea } from '../../src/LandingPage/uploadArea';
import FileManager from '../../src/LandingPage/FileManager';

InitSelectDocuments();
InitUploadArea();

// add function to pairing button
document.getElementById('make_pair').addEventListener('click', handleMakePair);
document.getElementById('upload_button').addEventListener('click', async () => {
  const circle = document.getElementById('loading_circle');
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
    document.getElementById('paired_list').innerHTML = '';
    document.getElementById('manuscript_list').innerHTML = '';
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
document.getElementById('right_col').appendChild(foobar);
