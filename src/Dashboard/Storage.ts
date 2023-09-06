import { v4 as uuidv4 } from 'uuid';
import PouchDB from 'pouchdb';
import { AllDocs, Doc, uploadsInfo } from '../Types';
import * as localManifest from '../../assets/manifest.json';

export const db = new PouchDB('Neon-User-Storage');

function getAllDocuments(): Promise<AllDocs> {
  return new Promise((resolve, reject) => {
    db.allDocs({ include_docs: true })
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

export async function fetchUploads(): Promise<uploadsInfo> {
  try {
    const res = await getAllDocuments();
    return res.rows.map(row => ({
      id: row.id,
      name: row.doc ? row.doc.name : 'undefined',
    }));
  } catch (err) {
    console.log('Couldn\'t fetch uploaded documents', err.message);
    return [];
  }
}

export function createManifest(id: string, title: string, mei: File, bg: File): Promise<string> {
  return new Promise(async (resolve) => {
    const manifest = JSON.parse(JSON.stringify(localManifest));
    manifest['@id'] = id;
    manifest['title'] = title;
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


/**
 * Add new entry to the database
 * @param id 
 * @param title 
 * @param content 
 * @param single is it a single page or a manuscript
 * @returns Promise<boolean>
 */
export function addDocument(id: string, name: string, content: Blob, single: boolean): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.put({
      _id: id,
      name: name,
      type: single ? 'page' : 'manuscript',
      _attachments: {
        manifest: {
          content_type: 'application/ld+json',
          data: content
        }
      }
    }).then(() => {
      resolve(true);
    }).catch(err => {
      window.alert(`Error Uploading Document: ${err.message}, title: ${name}, id: ${id}.`);
      reject(false);
    });
  });
}

/**
 * Delete entry from the database
 * @param id 
 * @returns Promise<boolean>
 */
export function deleteDocument(id: string): Promise<boolean> {
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

/**
 * Update the doc from the database (supports only title for now)
 * @param id 
 * @param newName 
 * @returns Promise<boolean>
 */
export function updateDocName(id: string, newName: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Retrieve doc from database (to get _rev)
    db.get<Doc>(id).then(doc => {

      // Retrieve manifest from database
      db.getAttachment(id, 'manifest').then((manifestBlob: Blob) => {
        manifestBlob.text().then(manifestText => {
          const manifest = JSON.parse(manifestText);
    
          // Update the manifest
          doc.name = newName;
          manifest['title'] = newName;
    
          // Convert back to blob
          const newManifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/ld+json' });

          doc._attachments['manifest'] = {
            content_type: 'application/ld+json',
            data: newManifestBlob
          };
          
          db.put(doc)
            .then(() => resolve(true))
            .catch(err => reject(err)); // db.put
        }).catch(err => reject(err)); // manifestTextPromise
      }).catch(err => reject(err)); // db.getAttachment
    }).catch(err => reject(err)); // db.get
  });
}
