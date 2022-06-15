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
  private allFiles = new Map<string, File>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  public addFile(file: File): void {
    if (!this.allFiles.has(file.name)) 
      this.allFiles.set(file.name, file);
  }

  public getFile(key: string): File {
    if (!this.allFiles.has(key)) {
      return this.allFiles.get(key);
    }
  }

  
}

export default FileManager;