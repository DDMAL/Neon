// script for '/deployment/views/index.pug'
console.log('landing.js is loading properly');

const initialUploadArea = document.getElementById('initial_upload_area');

// initialUploadArea
initialUploadArea.addEventListener('onclick', handleUploadInitial); // add click listener
initialUploadArea.addEventListener('dragover', (event) => { // add drag-and-drop functionality
  event.stopPropagation();
  event.preventDefault();
  console.log('dragover');
  initialUploadArea.classList.add('over');
  event.dataTransfer.dropEffect = 'copy';
});
initialUploadArea.addEventListener('drop', (event) => {
  event.stopPropagation();
  event.preventDefault();
  console.log('drop');
  initialUploadArea.classList.remove('over');
  const fileList = event.dataTransfer.files;
  console.log(fileList);
});
initialUploadArea.addEventListener('dragenter', _ => {
  initialUploadArea.classList.add('over');
});
initialUploadArea.addEventListener('dragleave', _ => {
  initialUploadArea.classList.remove('over');
});


function handleUploadInitial() {
  console.log('upload button clicked');
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;

  input.onchange = (event) => { 
    // const reader = new FileReader();
    const fileList = event.target.files; 
    for (file in fileList) {
      console.log(file);
    }
    // reader.readAsText(file,'UTF-8');

    // // here we tell the reader what to do when it's done reading...
    // reader.onload = readerEvent => {
    //   var content = readerEvent.target.result; // this is the content!
    //   console.log( content );
    // };

  };
  input.click();

  return false;
}

// function readFile(file) {
//   const reader = new FileReader();

// }
