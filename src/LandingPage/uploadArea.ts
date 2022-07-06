import { addNewFiles } from './uploadManager';

export function InitUploadArea(): void {
  // Make invisible input element for file system selector
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.onchange = () => { 
    const fileList: FileList = input.files; 
    const files = Array.from(fileList);
    const rejectFiles = addNewFiles(files);
    console.log('The following files are not .mei, .png, .jpeg, or .jsonld files: \n\n', rejectFiles);
  };

  // Upload area, add event listeners for click and drag and drop
  const upload_area = document.querySelector('#initial_upload_area') as HTMLDivElement;
  upload_area.onclick = () => input.click();
  upload_area.ondragleave = () => upload_area.classList.remove('over'); 
  upload_area.ondragover = (event) => { 
    event.stopPropagation();
    event.preventDefault();
    upload_area.classList.add('over');
    event.dataTransfer.dropEffect = 'copy';
  };
  upload_area.ondrop = (event) => {
    event.stopPropagation();
    event.preventDefault();
    upload_area.classList.remove('over');
    const fileList = event.dataTransfer.files;
    const files = Array.from(fileList);
    const rejectFiles = addNewFiles(files);
    console.log(rejectFiles);
  };
}