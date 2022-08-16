import { addNewFiles } from './UploadManager';
import { ModalWindow, ModalWindowView } from '../utils/ModalWindow';
import { handleUploadAllDocuments, handleMakePair } from './UploadManager';
import { updateDocumentSelector } from './DocumentSelector';
import { fm } from '../../deployment/scripts/dashboard';



export function InitUploadArea(): void {

  // generate modal window
  const modalWindow = new ModalWindow();
  modalWindow.setModalWindowView(ModalWindowView.DOCUMENT_UPLOAD);
  modalWindow.openModalWindow();

  document.querySelector('#make_pair')!.addEventListener('click', handleMakePair);

  document.querySelector('#upload_button')!.addEventListener('click', async function() {
    handleUploadAllDocuments()
      .then( (res) => {
        console.log('Upload results: ', res);
        updateAndClear();
      })
      .catch( (err) => {
        console.log('One or more uploads rejected: ', err);
        updateAndClear();
      });

    modalWindow.hideModalWindow();
  });

  // File System selector when clicking on upload area
  const fileSelector = document.createElement('input');
  fileSelector.type = 'file';
  fileSelector.multiple = true;
  fileSelector.addEventListener('change', function handleFileSelectorChange() { 
    const fileList: FileList = fileSelector.files; 
    const files = Array.from(fileList);
    const rejectFiles = addNewFiles(files);
    if (rejectFiles.length !== 0) {
      const filenames = rejectFiles.map(file => file.name);
      window.alert(`The following files are not .mei, .png, .jpeg, or .jsonld files: \n\n${filenames.join('\n')}`);
    }
    // remove selection
    fileSelector.value = null;
  });

  // Add event listeners for click and drag and drop
  const upload_area: HTMLDivElement = document.querySelector('#initial_upload_area');
  upload_area.onclick = () => fileSelector.click();
  // add visual cues for dragging files over upload area
  upload_area.ondragleave = () => upload_area.classList.remove('over'); 
  upload_area.ondragover = (event) => { 
    event.stopPropagation();
    event.preventDefault();
    upload_area.classList.add('over');
    event.dataTransfer.dropEffect = 'copy';
  };
  // receive files once files are dropped
  upload_area.ondrop = (event) => {
    event.stopPropagation();
    event.preventDefault();
    upload_area.classList.remove('over');
    const fileList = event.dataTransfer.files;
    const files = Array.from(fileList);
    const rejectFiles = addNewFiles(files);
    if (rejectFiles.length !== 0) {
      const filenames = rejectFiles.map(file => file.name);
      window.alert(`The following files are not .mei, .png, .jpeg, or .jsonld files: \n\n${filenames.join('\n')}`);
    }
  };
}


async function updateAndClear() {
  updateDocumentSelector().then( () => {
    document.querySelector('#paired_list')!.innerHTML = '';
    //document.querySelector('#manuscript_list')!.innerHTML = '';
    fm.clearFolios();
    // fm.clearManuscripts();
  });
}