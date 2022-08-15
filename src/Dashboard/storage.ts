import { v4 as uuidv4 } from 'uuid';
import PouchDB from 'pouchdb';
import { NeonManifest, allDocs } from '../Types';
import * as localManifest from '../../assets/manifest.json';
import { samples } from './samples_filenames';

const db = new PouchDB('Neon-User-Storage');
const manifestURL = 'https://ddmal.music.mcgill.ca/Neon/contexts/1/manifest.jsonld';

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

export function fetchSampleDocuments(): string[] {
  return samples;
}

export function createManifest(name: string, mei: File, bg: File): Promise<NeonManifest> {
  return new Promise(async (resolve) => {
    // get up-to-date manifest, else use local copy
    const manifest = await fetch(manifestURL)
      .then(result => result.json())
      .catch( (err) => {
        console.log('no connection: ', err);
        return localManifest;
      });
    manifest['@id'] = uuidv4();
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
