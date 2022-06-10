import FileBox from './FileBox';

interface Folio {
  mei: File,
  image: File
}

/**
 * Singleton management system, use getInstance() to retrieve instance.
 */
class FileManager {
  private static instance: FileManager;

  private meiFiles: File[] = [];
  private imageFiles: File[] = [];

  private iiifFiles: File[] = [];
  private folioPairs: Folio[] = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  public addNewFiles(fileList: FileList): File[] {
    const unacceptedFiles: File[] = [];
    const acceptedFiles: File[] = [];

    for (const file of fileList) {
      const filename = file.name;
      const ext = filename.split('.').pop();
      
      if (ext === 'mei') 
        this.meiFiles.push(file);
      else if (ext === 'png' || ext === 'jpeg' || ext === 'jpg')
        this.imageFiles.push(file);
      else if (ext === 'jsonld')
        this.iiifFiles.push(file);
      else {
        unacceptedFiles.push(file);
        continue;
      }
      acceptedFiles.push(file);
    }
    this.appendFileBoxes(acceptedFiles);
    return unacceptedFiles;
  }

  private appendFileBoxes(files: File[]) {
    const container = document.getElementById('unmatched_files_area');
    
    files.forEach((file: File) => {
      const box = FileBox(file);
      container.appendChild(box);
    });
  }

  public print(): void {
    console.log('mei: ', this.meiFiles);
    console.log('images: ', this.imageFiles);
    console.log('iiif: ', this.iiifFiles); 
  }

  public removeFile(file: File): boolean {
    [this.meiFiles, this.imageFiles, this.iiifFiles].forEach( (files: File[]) => {
      const pos = files.indexOf(file);
      if (pos !== -1) {
        files.splice(pos, 1);
        return true;
      }
    });
    return false;
  }

  public uploadFolio(folio: Folio): boolean {
    return false;
  }

  public uploadIiif(file: File): boolean {
    return false;
  }

  public uploadAll(folioPairs: Folio[], iiifFiles: File[]): boolean {
    return false;
  }
}

export default FileManager;