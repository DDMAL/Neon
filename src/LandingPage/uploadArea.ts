import { addNewFiles } from './uploadManager';
import { ModalWindow, ModalWindowView } from '../utils/ModalWindow';
import { handleUploadAllDocuments, handleMakePair } from './uploadManager';
import { updateDocumentSelector } from './DocumentSelector';
import { fm } from '../../deployment/scripts/dashboard';


export const uploadAreaHTML = 
  `<div id="document-upload-container">

    <div id="initial_upload_container">
      <div id="initial_upload_area">
        <div id="initial_upload_message">Upload Files</div>
      </div>
    </div>
    
    <div id="uploading_container">
      <div class="file_container" id="unpaired_container">

        <div class="file-container-title">Unpaired Documents</div>

        <div id="files_container">

          <div id="mei_container">
            <div class="file_heading">MEI</div>
            <div class="file_list" id="mei_list"></div>
          </div>

          <div id="image_container">
            <div class="file_heading">Images</div>
            <div class="file_list" id="image_list"></div>
          </div>

        </div>

        <div id="generate-pair-button-container">
          <div class="action_button" id="make_pair">Make Pair</div>
        </div>
      </div>

      <div class="file_container" id="paired_container">

        <div class="file-container-title">Paired Folios</div>
        
        <div class="tile_list" id="paired_list"></div>

        <div id="upload_button_container">
          <div class="action_button" id="upload_button">Upload</div>
        </div>

      </div>

      <!--
      <div class="file_container" id="manuscripts_container">
        <h2 class="file_heading">Manuscripts</h2>
        <div class="tile_list" id="manuscript_list"></div>
      </div>
      -->

    </div>
  </div>`;


export function InitUploadArea(): void {

  // generate modal window
  const modalWindow = new ModalWindow();
  modalWindow.setModalWindowView(ModalWindowView.DOCUMENT_UPLOAD);
  modalWindow.openModalWindow();

  document.querySelector('#make_pair')!.addEventListener('click', handleMakePair);

  document.querySelector('#upload_button')!.addEventListener('click', async () => {
    //const circle = document.querySelector('#loading_circle')!;
    //circle.className = 'loading';
    handleUploadAllDocuments()
      .then( (res) => {
        console.log('Upload results: ', res);
        updateAndClear();
        //circle.className = '';
      })
      .catch( (err) => {
        console.log('One or more uploads rejected: ', err);
        updateAndClear();
        //circle.className = '';
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