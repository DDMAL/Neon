import { uuidv4 } from '../utils/random';
import * as vkbeautify from 'vkbeautify';

/**
 * Manager for file uploading and pairing process
 */
class UploadFileManager {
  private static instance: UploadFileManager;

  private allFiles = new Map<string, { file: File; count: number }>();
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
    } else {
      const existingCount = this.getFileCount(file.name);
      const updatedEntry = { file: file, count: existingCount + 1 };
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

  public createMeiFile(
    filename: string,
    width: number,
    height: number,
    staffSpace: number,
  ): File {
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
      const surfaceId = 'm-' + uuidv4();
      surface.setAttribute('xml:id', surfaceId);
      surface.setAttribute('lrx', width.toString());
      surface.setAttribute('lry', height.toString());

      const zone = mei.querySelector('zone');
      const zoneId = 'm-' + uuidv4();
      zone.setAttribute('xml:id', zoneId);
      const marginRateV = 0.1;
      const marginRateH = 0.15;
      const marginV = Math.round(marginRateV * width);
      const marginH = Math.round(marginRateH * width);
      zone.setAttribute('ulx', marginH.toString());
      zone.setAttribute('uly', marginV.toString());
      zone.setAttribute('lrx', (width - marginH).toString());
      zone.setAttribute('lry', (marginV + 3 * staffSpace).toString());

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
      const pb = mei.querySelector('pb');
      pb.setAttribute('xml:id', 'm-' + uuidv4());
      pb.setAttribute('facs', '#' + surfaceId);
      const sb = mei.querySelector('sb');
      sb.setAttribute('xml:id', 'm-' + uuidv4());
      sb.setAttribute('facs', '#' + zoneId);

      const meiFileContent = vkbeautify.xml(
        serializer.serializeToString(meiDoc),
      );
      const meiBlob = new Blob([meiFileContent], { type: 'text/xml' });

      return new File([meiBlob], filename, { type: 'text/xml' });
    } catch (error) {
      console.error(error);
    }
  }

  public getImgDimension(
    filename: string,
  ): Promise<{ width: number; height: number; staffSpace: number }> {
    return new Promise((resolve, reject) => {
      const imgFile = this.getFile(filename);

      if (!imgFile) {
        reject(new Error(`File not found: ${filename}`));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            reject(new Error('Could not get 2D context'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Binarization
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const binaryThreshold = 127;
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const binaryValue = grayscale < binaryThreshold ? 0 : 255;
            data[i] = binaryValue;
            data[i + 1] = binaryValue;
            data[i + 2] = binaryValue;
          }
          ctx.putImageData(imageData, 0, 0);

          // Finding staff space
          const whiteRunLengths: number[] = [];
          let currSpaceCount = 0;
          for (let x = 0; x < canvas.width; x++) {
            // new currSpaceCount for every column
            const column = ctx.getImageData(x, 0, 1, canvas.height).data;
            for (let p = 0; p < column.length; p += 4) {
              // Check if the pixel is black (0) or white (255)
              if (column[p] === 0 && currSpaceCount > 0) {
                whiteRunLengths.push(currSpaceCount);
                currSpaceCount = 0;
              } else {
                currSpaceCount++;
              }
            }
          }

          // Get the second most common value as staff space
          const staffSpace =
            whiteRunLengths.length > 0
              ? this.findSecondMode(whiteRunLengths)
              : 0;

          resolve({
            width: img.width,
            height: img.height,
            staffSpace: staffSpace,
          });
        };
        img.onerror = () => {
          reject(new Error(`Failed to load image: ${filename}`));
        };
        img.src = event.target.result as string;
      };

      reader.readAsDataURL(imgFile);
    });
  }

  private findSecondMode(arr: number[]): number {
    const countMap: Map<number, number> = new Map();

    // Count occurrences of each element
    arr.forEach((element) => {
      const count = (countMap.get(element) || 0) + 1;
      countMap.set(element, count);
    });

    const sortedMap = Array.from(countMap.entries()).sort(
      (a, b) => b[1] - a[1],
    );

    return sortedMap[1][0];
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
    } else {
      const updatedEntry = {
        file: this.allFiles.get(key).file,
        count: count - 1,
      };
      this.allFiles.set(key, updatedEntry);
    }
  }

  public getFileCount(key: string): number {
    if (this.allFiles.has(key)) {
      return this.allFiles.get(key).count;
    } else return 0;
  }

  public addFolio(
    name: string,
    mei: string,
    image: string,
    isCreated: boolean,
  ): void {
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
    const idx = this.folios.findIndex((folio) => folio.filename === filename);
    this.folios.splice(idx, 1);
  }

  // public removeManuscript(filename: string): void {
  //   const idx = this.manuscripts.findIndex(manuscript => manuscript === filename);
  //   this.manuscripts.splice(idx);
  //   this.removeFile(filename);
  // }

  public getFolios(): [string, File, File][] {
    return this.folios.map((folio) => {
      const filename = folio.filename;
      const mei_filename = folio.mei_filename;
      const image_filename = folio.image_filename;
      return [
        filename,
        this.getFile(mei_filename),
        this.getFile(image_filename),
      ];
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
  filename: string;
  mei_filename: string;
  image_filename: string;
  isCreated: boolean;
};
