import { uuidv4 } from '../utils/random';
import * as vkbeautify from 'vkbeautify';

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
    }
  }

  public createMeiFile(filename: string): File {
    try {
      if (!this.meiTemplate) {
        throw new Error('Cannot find MEI template');
      }

      const parser = new DOMParser();
      const serializer = new XMLSerializer();
      const meiDoc = parser.parseFromString(this.meiTemplate, 'text/xml');
      const mei = meiDoc.documentElement;

      const meiHead = mei.querySelector('meiHead');
      meiHead.setAttribute('xml:id', 'm-' + uuidv4());
      const fileDesc = mei.querySelector('fileDesc');
      fileDesc.setAttribute('xml:id', 'm-' + uuidv4());
      const titleStmt = mei.querySelector('titleStmt');
      titleStmt.setAttribute('xml:id', 'm-' + uuidv4());
      const title = mei.querySelector('title');
      title.setAttribute('xml:id', 'm-' + uuidv4());
      const pubStmt = mei.querySelector('pubStmt');
      pubStmt.setAttribute('xml:id', 'm-' + uuidv4());
      const facsimile = mei.querySelector('facsimile');
      facsimile.setAttribute('xml:id', 'm-' + uuidv4());
      const surface = mei.querySelector('surface');
      surface.setAttribute('xml:id', 'm-' + uuidv4());

      const mdiv = mei.querySelector('mdiv');
      mdiv.setAttribute('xml:id', 'm-' + uuidv4());
      const score = mei.querySelector('score');
      score.setAttribute('xml:id', 'm-' + uuidv4());
      const scoreDef = mei.querySelector('scoreDef');
      scoreDef.setAttribute('xml:id', 'm-' + uuidv4());
      const staffGrp = mei.querySelector('staffGrp');
      staffGrp.setAttribute('xml:id', 'm-' + uuidv4());
      const staffDef = mei.querySelector('staffDef');
      staffDef.setAttribute('xml:id', 'm-' + uuidv4());
      const section = mei.querySelector('section');
      section.setAttribute('xml:id', 'm-' + uuidv4());
      const staff = mei.querySelector('staff');
      staff.setAttribute('xml:id', 'm-' + uuidv4());
      const layer = mei.querySelector('layer');
      layer.setAttribute('xml:id', 'm-' + uuidv4());
      const zone = mei.querySelector('zone');
      zone.setAttribute('xml:id', 'm-' + uuidv4());
      staff.setAttribute('facs', '#'+zone.getAttribute('xml:id'));

      const meiFileContent = vkbeautify.xml(serializer.serializeToString(meiDoc));
      const meiBlob = new Blob([meiFileContent], { type: 'text/xml' });

      return new File([meiBlob], filename, { type: 'text/xml' });
    } catch (error) {
      console.error(error);
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

  public addFolio(name: string, mei: string, image: string, isCreated: boolean): void {
    const newFolio: folio = {
      filename: name,
      mei_filename: mei,
      image_filename: image,
      isCreated: isCreated,
    };
    this.folios.push(newFolio);
  }

  // public addManuscript(filename: string): void {
  //   this.manuscripts.push(filename);
  // }

  public isCreatedFolio(filename: string): boolean {
    const folio = this.folios.find((folio) => folio.filename === filename);
    return folio ? folio.isCreated : false;
  }

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
  isCreated: boolean,
};