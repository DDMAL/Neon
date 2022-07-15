/**
 * Singleton management system, use getInstance() to retrieve instance.
 */
class FileManager {
  private static instance: FileManager;

  private allFiles = new Map<string, {file: File, count: number}>();
  private folios = new Array<[string, string]>();
  private manuscripts = new Array<string>();

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
    if (this.allFiles.has(key)) {
      return this.allFiles.get(key).file;
    }
  }

  public removeFile(key: string): void {
    const count = this.getFileCount(key);
    if (count === 0) return;
    else if (count === 1) {
      this.allFiles.delete(key);
    }
    else {
      const updatedEntry = { file: this.allFiles.get(key).file, count: count-1 };
      this.allFiles.set(key, updatedEntry);
    }
  }

  public getFileCount(key: string): number {
    if ( this.allFiles.has(key) ) {
      return this.allFiles.get(key).count;
    }
    else return 0;
  }

  public addFolio(mei: string, image: string): void {
    this.folios.push([mei, image]);
  }

  public addManuscript(filename: string): void {
    this.manuscripts.push(filename);
  }

  public removeFolio(mei_filename: string): void {
    const idx = this.folios.findIndex( folio => folio[0] === mei_filename);
    this.folios.splice(idx, 1);
  }

  public removeManuscript(filename: string): void {
    const idx = this.manuscripts.findIndex(manuscript => manuscript === filename);
    this.manuscripts.splice(idx);
    this.removeFile(filename);
  }

  public getFolios(): [File, File][] {
    return this.folios.map( folio => {
      const mei_filename = folio[0];
      const image_filename = folio[1];
      return [this.getFile(mei_filename), this.getFile(image_filename)];
    });
  }

  public getManuscripts(): File[] {
    return this.manuscripts.map( manuscript => this.getFile(manuscript));
  }

  public clearFolios(): void {
    this.folios.forEach( ([mei_filename, image_filename]: [string,string]) => {
      this.removeFile(mei_filename);
      this.removeFile(image_filename);
    });
    this.folios = [];
  }

  public clearManuscripts(): void {
    this.manuscripts.forEach( filename => {
      this.removeFile(filename);
    });
    this.manuscripts = [];
  }

  public print(): void {
    console.log(this.allFiles);
    console.log(this.folios);
    console.log(this.manuscripts);
  }
}

export default FileManager;