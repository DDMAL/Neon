import { ModalWindow, ModalWindowView } from '../utils/ModalWindow';
import {
  addNewFiles,
  handleUploadAllDocuments,
  handleMakePair,
  sortFileByName,
  UploadResult,
} from './UploadTools';
import { updateDashboard, markNewlyUploaded } from './Dashboard';
import { IFolder } from './FileSystem';
import {
  getUploadNotationType,
  setUploadNotationType,
} from './UploadNotationType';

// Narrows a fulfilled UploadResult down to one with a non-null value, so
// successfulFiles below is typed as { id: string; name: string }[] instead of
// carrying the original optional value.
function isSuccessfulUpload(
  result: UploadResult,
): result is UploadResult & { value: { id: string; name: string } } {
  return result.status === 'fulfilled' && result.value != null;
}

// Guards against overlapping upload batches: the upload button isn't disabled
// while a batch is pending, so a second click could otherwise let an older
// batch's delayed callback run after a newer one and clobber its highlights.
let isUploadPending = false;

async function handleUploadUpdate(
  modalWindow: ModalWindow,
  currentFolder: IFolder,
) {
  if (isUploadPending) {
    return;
  }
  isUploadPending = true;

  const spinner = document.querySelector('#uploading_spinner');
  spinner.classList.add('visible');

  const selectedNotationType: HTMLInputElement = document.querySelector(
    'input[name="upload_notation_type"]:checked',
  );
  const notationType = selectedNotationType?.value ?? 'square';

  handleUploadAllDocuments(currentFolder, notationType)
    .then((results) => {
      const successfulFiles = results
        .filter(isSuccessfulUpload)
        .map((result) => result.value);

      setTimeout(async () => {
        try {
          markNewlyUploaded(successfulFiles.map((file) => file.id));
          await updateDashboard();
          spinner.classList.remove('visible');
          modalWindow.hideModalWindow();

          if (successfulFiles.length > 0) {
            const infoBadge = document.getElementById('info-badge');
            infoBadge.textContent = `Uploaded files: ${successfulFiles
              .map((file) => file.name)
              .join(', ')}`;
            infoBadge.style.display = 'block';
            infoBadge.style.background = '#9DB2BF';
          }
        } finally {
          isUploadPending = false;
        }
      }, 2000);
    })
    .catch((error) => {
      console.log('One or more uploads rejected: ', error);
      setTimeout(async () => {
        try {
          await updateDashboard();
          spinner.classList.remove('visible');
          modalWindow.hideModalWindow();
        } finally {
          isUploadPending = false;
        }
      }, 2000);
    });
}

export function InitUploadArea(currentFolder: IFolder): void {
  // generate modal window
  const modalWindow = new ModalWindow();
  modalWindow.setModalWindowView(ModalWindowView.DOCUMENT_UPLOAD);
  modalWindow.openModalWindow();

  const pairButton = document.querySelector('#make_pair');
  const uploadButton = document.querySelector('#upload_button');
  const notationTypeInputs: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('input[name="upload_notation_type"]');
  const savedNotationType = getUploadNotationType();

  notationTypeInputs.forEach((input) => {
    input.checked = input.value === savedNotationType;
    input.addEventListener('change', () => {
      if (input.checked) setUploadNotationType(input.value);
    });
  });

  pairButton.addEventListener('click', handleMakePair);
  uploadButton.addEventListener('click', () =>
    handleUploadUpdate(modalWindow, currentFolder),
  );

  // request user file system when clicking on upload area
  const fileSelector = document.createElement('input');
  fileSelector.type = 'file';
  fileSelector.multiple = true;
  fileSelector.addEventListener('change', function handleFileSelectorChange() {
    const fileList: FileList = fileSelector.files;
    const files = Array.from(fileList);
    const rejectFiles = addNewFiles(files);
    if (rejectFiles.length !== 0) {
      const filenames = rejectFiles.map((file) => file.name);
      window.alert(
        `The following files are not .mei, .png, .jpeg, or .jsonld files: \n\n${filenames.join(
          '\n',
        )}`,
      );
    }
    // remove selection
    fileSelector.value = null;
  });

  // Add event listeners for click and drag and drop
  const upload_area: HTMLDivElement = document.querySelector(
    '#initial_upload_area',
  );
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
      const filenames = rejectFiles.map((file) => file.name);
      window.alert(
        `The following files are not .mei, .png, .jpeg, or .jsonld files: \n\n${filenames.join(
          '\n',
        )}`,
      );
    }
  };

  // Listener for sorting file/folio
  const sortByNameBtns = document.querySelectorAll('.sort_name');
  sortByNameBtns.forEach((sortByNameBtn) => {
    sortByNameBtn.addEventListener('click', () =>
      sortFileByName(sortByNameBtn),
    );
  });
}
