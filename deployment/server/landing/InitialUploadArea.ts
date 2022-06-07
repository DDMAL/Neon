import FileManager from './FileManager';

/**
 * Initial upload area component click, drag and drop functionality for storing documents (folios, manuscripts).
 * @returns InitialUploadArea Node
 */
const InitialUploadArea = (): HTMLElement => {
  const fm = FileManager.getInstance();

  const node = document.createElement('div');
  node.id = 'initial_upload_area';
  const text = document.createElement('span');
  text.id = 'initial_upload_message';
  text.innerText = 'Upload Files';
  node.appendChild(text);

  function handleClick(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;

    input.onchange = (event) => { 
      // const reader = new FileReader();
      const fileList: FileList = event.target['files']; 
      console.log(fileList);
      fm.addNewFiles(fileList);
    };
    input.click();
  }

  // Add event listeners
  node.addEventListener('click', handleClick);
  node.addEventListener('dragleave', () => node.classList.remove('over')); 
  node.addEventListener('dragover', (event) => { 
    event.stopPropagation();
    event.preventDefault();
    node.classList.add('over');
    event.dataTransfer.dropEffect = 'copy';
  });
  node.addEventListener('drop', (event) => {
    event.stopPropagation();
    event.preventDefault();
    node.classList.remove('over');
    const fileList = event.dataTransfer.files;
    fm.addNewFiles(fileList);
  });
  
  return node;
};

export default InitialUploadArea;