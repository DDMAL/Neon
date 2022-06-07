import InitialUploadArea from './landing/InitialUploadArea';
import FileManager from './landing/FileManager';

const select = (id: string) => document.getElementById(id);

const fm = FileManager.getInstance();

// initialize file drop box
select('initial_upload_container').appendChild(InitialUploadArea());

