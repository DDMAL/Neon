import { InitDocumentSelector } from '../../src/Dashboard/DocumentSelector';
import { InitUploadArea } from '../../src/Dashboard/UploadArea';

InitDocumentSelector();

document.querySelector('#upload-new-doc-button')?.addEventListener('click', function() {
  InitUploadArea();
});

document.querySelector('#home-link')?.setAttribute('href', __LINK_LOCATION__);

