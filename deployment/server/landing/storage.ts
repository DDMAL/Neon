import { v4 as uuidv4 } from 'uuid';
import PouchDB from 'pouchdb';

const db = new PouchDB('Neon-User-Storage');

export function getAllDocuments(): Promise<PouchDB.Core.AllDocsResponse<unknown>> {
  return new Promise((resolve, reject) => {
    db.allDocs({ include_docs: true }).then(result => { resolve(result); })
      .catch(err => { reject(err); });
  });
}

export function createManifest(mei: File, bg: File): Promise<Record<string, unknown>> {
  return new Promise(async (resolve) => {
    const manifest = await fetch('https://ddmal.music.mcgill.ca/Neon/contexts/1/manifest.jsonld')
      .then(result => {
        if (result.ok) {
          return result.json();
        }
      });
    manifest['@id'] = uuidv4();
    manifest['title'] = mei.name;
    manifest['timestamp'] = (new Date()).toISOString();

    const meiPromise = new Promise(resolve => {
      const meiReader = new FileReader();
      meiReader.addEventListener('load', () => {
        resolve(meiReader.result);
      });
      meiReader.readAsDataURL(mei);
    });
    const bgPromise = new Promise(resolve => {
      const bgReader = new FileReader();
      bgReader.addEventListener('load', () => {
        resolve(bgReader.result);
      });
      bgReader.readAsDataURL(bg);
    });

    const meiUri = await meiPromise;
    const bgUri = await bgPromise;
    manifest['image'] = bgUri;
    manifest['mei_annotations'] = [
      {
        id: uuidv4(),
        type: 'Annotation',
        body: meiUri,
        target: bgUri
      }
    ];
    resolve(manifest);
  });
}

export function addEntry(title: string, content: Blob, single: boolean): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.put({
      _id: title,
      kind: single ? 'page' : 'manuscript',
      _attachments: {
        manifest: {
          content_type: 'application/ld+json',
          data: content
        }
      }
    }).then(_ => {
      resolve(true);
    }).catch(err => {
      window.alert(`Error Uploading Document: ${err.message}, ${title}.`);
      reject(false);
    });
  });
}

export function deleteEntry(id: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.get(id)
      .then(doc => {
        db.remove(doc)
          .then(_ => {
            resolve(true);
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}
