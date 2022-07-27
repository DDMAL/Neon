import NeonView from '../../src/NeonView';
import DisplayPanel from '../../src/DisplayPanel/DisplayPanel';
import DivaView from '../../src/DivaView';
import SingleView from '../../src/SingleView/SingleView';
import DivaEdit from '../../src/SquareEdit/DivaEditMode';
import SingleEditMode from '../../src/SquareEdit/SingleEditMode';
import InfoModule from '../../src/InfoModule';
import TextView from '../../src/TextView';
import TextEditMode from '../../src/TextEditMode';
import { NeonViewParams } from '../../src/Interfaces';
import { NeonManifest } from '../../src/Types';
import PouchDB from 'pouchdb';

const name = getGetParam('manifest');
const storage = getGetParam('storage');

console.log(name);

if (name) {
  const manifestLocation = `./samples/manifests/${name}.jsonld`;
  window.fetch(manifestLocation).then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error(response.statusText);
    }
  }).then(async text => {
    let manifest: NeonManifest;
    try {
      manifest = JSON.parse(text);
    } catch (e) {
      console.error(e);
      console.debug(text);
      return;
    }
    // Determine if it is a single page or multiple by media type
    const mediaType: string = await new Promise((resolve, reject) => {
      window.fetch(manifest.image).then(response => {
        resolve(<string>response.headers.get('Content-Type'));
      }).catch(err => {
        reject(err);
      });
    });

    let params: NeonViewParams;
    if (mediaType.match(/image\/*/)) {
      params = {
        manifest: manifest,
        Display: DisplayPanel,
        Info: InfoModule,
        TextView: TextView,
        TextEdit: TextEditMode,
        View: SingleView,
        NeumeEdit: SingleEditMode
      };
    } else {
      params = {
        manifest: manifest,
        Display: DisplayPanel,
        Info: InfoModule,
        TextView: TextView,
        TextEdit: TextEditMode,
        View: DivaView,
        NeumeEdit: DivaEdit
      };
    }

    const view = new NeonView(params);
    view.start();
  });
} else {
  const db = new PouchDB('Neon-User-Storage');
  db.getAttachment(storage, 'manifest').then(blob => {
    return new window.Response(blob).json();
  }).then(async manifest => {
    console.log(manifest);

    const mediaType: string = await new Promise((resolve, reject) => {
      window.fetch(manifest.image).then(response => {
        resolve(<string>response.headers.get('Content-Type'));
      }).catch(err => {
        reject(err);
      });
    });

    let params: NeonViewParams;
    if (mediaType.match(/image\/*/)) {
      params = {
        manifest: manifest,
        Display: DisplayPanel,
        Info: InfoModule,
        TextView: TextView,
        TextEdit: TextEditMode,
        View: SingleView,
        NeumeEdit: SingleEditMode
      };
    } else {
      params = {
        manifest: manifest,
        Display: DisplayPanel,
        Info: InfoModule,
        TextView: TextView,
        TextEdit: TextEditMode,
        View: DivaView,
        NeumeEdit: DivaEdit
      };
    }

    const view = new NeonView(params);
    view.start();
  });
}

function getGetParam(paramName): string {
  let result;

  window.location.search
    .substr(1)
    .split('&')
    .forEach((item) => {
      const tmp = item.split('=');
      if (tmp[0] === paramName) {
        result = decodeURIComponent(tmp[1]);
      }
    });
  return result;
}
