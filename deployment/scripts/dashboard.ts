import { InitDocumentSelector, updateDocumentSelector } from '../../src/Dashboard/DocumentSelector';
import { handleMakePair, handleUploadAllDocuments } from '../../src/Dashboard/UploadManager';
import { InitUploadArea } from '../../src/Dashboard/uploadArea';
import FileManager from '../../src/Dashboard/FileManager';

export const fm = FileManager.getInstance();
export const selectedDocs = [];

InitDocumentSelector();

document.querySelector('#upload-new-doc-button')?.addEventListener('click', function() {
  InitUploadArea();
});

