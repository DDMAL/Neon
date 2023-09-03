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
export function addDocument(id: string, title: string, content: Blob, single: boolean): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.put({
      _id: id,
      kind: single ? 'page' : 'manuscript',
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
 * @param title 
 * @returns Promise<boolean>
 */
export function updateDocument(id: string, title: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Retrieve doc from database (to get _rev)
    db.get(id).then(doc => {

      // Retrieve manifest from database
      db.getAttachment(id, 'manifest').then((manifestBlob: Blob) => {
        manifestBlob.text().then(manifestText => {
          const manifest = JSON.parse(manifestText);
    
          // Update the manifest
          manifest['title'] = title;
    
          // Convert back to blob
          const updatedManifest = JSON.stringify(manifest, null, 2);
          const updatedManifestBlob = new Blob([updatedManifest], { type: 'application/ld+json' });

          // update the database, specify the id and _rev of the doc
          db.putAttachment(id, 'manifest', doc._rev, updatedManifestBlob, 'application/ld+json')
            .then(() => resolve(true))
            .catch(err => reject(err)); // db.putAttachment

        }).catch(err => reject(err)); // manifestTextPromise
      }).catch(err => reject(err)); // db.getAttachment
    }).catch(err => reject(err)); // db.get
  });
}
