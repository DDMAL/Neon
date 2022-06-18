// interface Folio {
//   mei: File,
//   image: File
// }

/**
 * Singleton management system, use getInstance() to retrieve instance.
 */
class FileManager {
  private static instance: FileManager;

  // private meiFiles: File[] = [];
  // private imageFiles: File[] = [];
  // private iiifFiles: File[] = [];
  // private folioPairs: Folio[] = [];
  private allFiles = new Map<string, {file: File, count: number}>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  public addFile(file: File): void {
    if (!this.allFiles.has(file.name)) {
      const newEntry = { file: file, count: 1 };
      this.allFiles.set(file.name, newEntry);
    }
    else {
      const existingCount = this.getFileCount(file.name);
      const updatedEntry = { file: file, count: existingCount+1 };
      this.allFiles.set(file.name, updatedEntry);
    }
  }

  public getFile(key: string): File {
    if (!this.allFiles.has(key)) {
      return this.allFiles.get(key)['file'];
    }
  }

  public removeFile(key: string): void {
    const count = this.getFileCount(key);
    if (count === 0) return;
    else if (count === 1) {
      this.allFiles.delete(key);
    }
    else {
      const updatedEntry = { file: this.allFiles.get(key)['file'], count: count-1 };
      this.allFiles.set(key, updatedEntry);
    }
  }

  public getFileCount(key: string): number {
    if ( this.allFiles.has(key) ) {
      return this.allFiles.get(key)['count'];
    }
    else return 0;
  }

  public print():void {
    console.log(this.allFiles, 'hi');
  }
  
}

export default FileManager;