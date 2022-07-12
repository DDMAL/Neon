import { InitDocumentSelector, updateDocumentSelector } from '../../src/LandingPage/DocumentSelector';
import { handleMakePair, handleUploadAllDocuments } from '../../src/LandingPage/UploadManager';
import { InitUploadArea } from '../../src/LandingPage/uploadArea';
import FileManager from '../../src/LandingPage/FileManager';

export const fm = FileManager.getInstance();
export const selectedDocs = [];
export var commandKeyIsPressed = false;

InitDocumentSelector();

document.querySelector('#upload-new-doc-button')?.addEventListener('click', function() {
  InitUploadArea();
});

