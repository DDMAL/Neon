import { ModalWindow, ModalWindowView } from '../utils/ModalWindow';
import { addNewFiles, handleUploadAllDocuments, handleMakePair } from './upload_functions';
import { updateDocumentSelector } from './DocumentSelector';
import { IFolder } from './FileSystem';

async function handleUploadUpdate(modalWindow: ModalWindow, currentFolder: IFolder) {
  const spinner = document.querySelector('#uploading_spinner');
  spinner.classList.add('visible');

  handleUploadAllDocuments(currentFolder)
    .then( () => {
      setTimeout( async () => {
        await updateDocumentSelector();
        spinner.classList.remove('visible');
        modalWindow.hideModalWindow();
      }, 2000);
    })
    .catch( (error) => {
      console.log('One or more uploads rejected: ', error);
      setTimeout( async () => {
        await updateDocumentSelector();
        spinner.classList.remove('visible');
        modalWindow.hideModalWindow();
      }, 2000);
    });
}

export function InitUploadArea(currentFolder: IFolder): void {
  // generate modal window
  const modalWindow = new ModalWindow();
  modalWindow.setModalWindowView(ModalWindowView.DOCUMENT_UPLOAD);
  modalWindow.openModalWindow();

  document.querySelector('#make_pair')!.addEventListener('click', handleMakePair);
  document.querySelector('#upload_button')!.addEventListener('click', () => handleUploadUpdate(modalWindow, currentFolder));

  // request user file system when clicking on upload area
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