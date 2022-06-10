import FileManager from './FileManager';

const FileBox = (file: File): HTMLElement => {
  const fm = FileManager.getInstance();
  const filename = file.name;
  const ext = filename.split('.').pop();

  const box = document.createElement('div');
  box.className = 'file_box';
  box.draggable = true;
  const text = document.createElement('span');
  text.className = 'file_box_name';
  text.textContent = filename;
  const delBtn = document.createElement('button');
  delBtn.innerHTML= 'x';
  box.appendChild(text);
  box.appendChild(delBtn);

  const handleRemove = () => {
    fm.removeFile(file);
    box.remove();
  };

  const handleDragStart = () => {
    box.style.opacity = '0.4';
  };

  const handleDragEnd = () => {
    box.style.opacity = '1';
  };

  box.addEventListener('dragstart', handleDragStart);
  box.addEventListener('dragend', handleDragEnd);


  delBtn.addEventListener('click', handleRemove);

  return box;
};

export default FileBox;