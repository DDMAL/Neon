export const InitSelectDocuments = (folioNames: string[], manuscriptNames: string[]): void => {
  const folioGroup = document.getElementById('uploaded_folios');
  const manuscriptGroup = document.getElementById('uploaded_manuscripts');
  folioNames.sort(); 
  manuscriptNames.sort();

  if (folioNames.length === 0) {
    const optGroup = document.getElementById('uploaded_folios') as HTMLOptGroupElement;
    optGroup.label = 'No Folios Uploaded';
  } 
  else folioNames.forEach(str => {
    const option = document.createElement('option');
    option.value = option.innerText = str;
    folioGroup.appendChild(option);
  });
  if (manuscriptNames.length === 0) {
    const optGroup = document.getElementById('uploaded_manuscripts') as HTMLOptGroupElement;
    optGroup.label = 'No Manuscripts Uploaded';
  } 
  else manuscriptNames.forEach(str => {
    const option = document.createElement('option');
    option.value = option.innerText = str;
    manuscriptGroup.appendChild(option);
  });

  const handleOpenDocuments = () => getSelection().forEach(filename => openEditorTab(filename));

  function getSelection() {
    const dropdown = document.getElementById('documents_dropdown') as HTMLSelectElement;
    return [...dropdown.options]
      .filter(option => option.selected)
      .map(option => option.value);
  }

  function openEditorTab(filename: string) {
    // const params = makeParams({ storage: filename });
    window.open(`./edit/${filename} `, '_blank');
  }

  // function makeParams(obj): string {
  //   return Object.keys(obj).map(key => {
  //     return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
  //   }).join('&');
  // }

  function handleDeleteDocuments() {
    window.alert('do something delety');
  }

  const openButton = document.getElementById('open_documents');
  openButton.addEventListener('click', handleOpenDocuments);
  const deleteButton = document.getElementById('delete_documents');
  deleteButton.addEventListener('click', handleDeleteDocuments);
};