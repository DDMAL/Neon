/**
 * Manager for file uploading and pairing process
 */
class UploadFileManager {
  private static instance: UploadFileManager;

  private allFiles = new Map<string, {file: File, count: number}>();
  private folios = new Array<folio>(); // filename, mei_filename, image_filename
  // private manuscripts = new Array<string>();
  private meiTemplate: string;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): UploadFileManager {
    if (!UploadFileManager.instance) {
      UploadFileManager.instance = new UploadFileManager();
    }
    return UploadFileManager.instance;
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

  public async setMeiTemplate(templatePath: string): Promise<void> {
    try {
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Failed to load MEI template from ${templatePath}`);
      }

      this.meiTemplate = await response.text();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public createMeiFile(filename: string): void {
    // 
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

  public addFolio(name: string, mei: string, image: string): void {
    const newFolio: folio = {
      filename: name,
      mei_filename: mei,
      image_filename: image
    };
    this.folios.push(newFolio);
  }

  // public addManuscript(filename: string): void {
  //   this.manuscripts.push(filename);
  // }

  public removeFolio(filename: string): void {
    const idx = this.folios.findIndex( folio => folio.filename === filename);
    this.folios.splice(idx, 1);
  }

  // public removeManuscript(filename: string): void {
  //   const idx = this.manuscripts.findIndex(manuscript => manuscript === filename);
  //   this.manuscripts.splice(idx);
  //   this.removeFile(filename);
  // }

  public getFolios(): [string, File, File][] {
    return this.folios.map( folio => {
      const filename = folio.filename;
      const mei_filename = folio.mei_filename;
      const image_filename = folio.image_filename;
      return [filename, this.getFile(mei_filename), this.getFile(image_filename)];
    });
  }

  // public getManuscripts(): File[] {
  //   return this.manuscripts.map( manuscript => this.getFile(manuscript));
  // }

  // public clearManuscripts(): void {
  //   this.manuscripts.forEach( filename => {
  //     this.removeFile(filename);
  //   });
  //   this.manuscripts = [];
  // }
  
  public clear(): void {
    this.allFiles.clear();
    this.folios.splice(0);
  }

  public print(): void {
    console.log(this.allFiles);
    console.log(this.folios);
    // console.log(this.manuscripts);
  }
}

export default UploadFileManager;

type folio = {
  filename: string,
  mei_filename: string,
  image_filename: string,
};