import { v4 as uuidv4 } from 'uuid';
import PouchDB from 'pouchdb';
import { allDocs } from '../Types';
import * as localManifest from '../../assets/manifest.json';

const db = new PouchDB('Neon-User-Storage');

function getAllDocuments(): Promise<allDocs> {
  return new Promise((resolve, reject) => {
    db.allDocs({ include_docs: true })
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

export async function fetchUploadedDocuments(): Promise<string[]> {
  return await getAllDocuments()
    .then( (res: allDocs) => {
      return res.rows.map( row => row.key);
    })
    .catch(err => {
      console.log('Could\'nt fetch uploaded documents', err.message);
      return [];
    });
}

export function createManifest(id: string, name: string, mei: File, bg: File) {
  return new Promise(async (resolve) => {
    const manifest = JSON.parse(JSON.stringify(localManifest));
    manifest['@id'] = id;
    manifest['title'] = name;
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

export function addEntry(id: string, title: string, content: Blob, single: boolean): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.put({
      _id: id,
      kind: single ? 'page' : 'manuscript', // TODO: make enum file type
      _attachments: {
        manifest: {
          content_type: 'application/ld+json',
          data: content
        }
      }
    }).then(() => {
      resolve(true);
    }).catch(err => {
      window.alert(`Error Uploading Document: ${err.message}, title: ${title}, id: ${id}.`);
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
