import { addNewFiles } from './uploadManager';
import { ModalWindow, ModalWindowView } from '../utils/ModalWindow';
import { handleUploadAllDocuments, handleMakePair } from './uploadManager';
import { updateDocumentSelector } from './DocumentSelector';
import { fm } from '../../deployment/scripts/dashboard';



export function InitUploadArea(): void {

  // generate modal window
  const modalWindow = new ModalWindow();
  modalWindow.setModalWindowView(ModalWindowView.DOCUMENT_UPLOAD);
  modalWindow.openModalWindow();

  document.querySelector('#make_pair')!.addEventListener('click', handleMakePair);

  document.querySelector('#upload_button')!.addEventListener('click', async () => {
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

  // Make invisible input element for file system selector
  const fileSelector = document.createElement('input');
  fileSelector.type = 'file';
  fileSelector.multiple = true;

  fileSelector.addEventListener('change', function handleFileSelectorChange() { 
    const fileList: FileList = fileSelector.files; 
    const files = Array.from(fileList);
    const rejectFiles = addNewFiles(files);
    if (rejectFiles.length !== 0) 
      console.log('The following files are not .mei, .png, .jpeg, or .jsonld files: \n\n', rejectFiles);
    // remove selection
    fileSelector.value = null;
  });

  // Upload area, add event listeners for click and drag and drop
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
    // addNewFiles handles adding files, rejectFiles is an array of non compatible files
    const rejectFiles = addNewFiles(files);
    console.log(rejectFiles);
  };
}


async function updateAndClear() {
  updateDocumentSelector().then( () => {
    document.querySelector('#paired_list')!.innerHTML = '';
    //document.querySelector('#manuscript_list')!.innerHTML = '';
    fm.clearFolios();
    fm.clearManuscripts();
  });
}