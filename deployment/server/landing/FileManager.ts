/**
 * Singleton management system, use getInstance() to retrieve instance.
 */
class FileManager {
  private static instance: FileManager;

  private meiFiles: File[] = [];
  private imageFiles: File[] = [];
  private iiifFiles: File[] = [];

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

    for (const file of fileList) {
      const filename = file.name;
      const ext = filename.split('.').pop();
      
      if (ext === 'mei') 
        this.meiFiles.push(file);
      else if (ext === 'png' || ext === 'jpeg' || ext === 'jpg')
        this.imageFiles.push(file);
      else if (ext === 'iiif')
        this.iiifFiles.push(file);
      else
        unacceptedFiles.push(file);
    }
    return unacceptedFiles;
  }
}

export default FileManager;