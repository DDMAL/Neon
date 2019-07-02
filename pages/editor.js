import NeonView from '../src/NeonView.js';
import DisplayPanel from '../src/DisplayPanel/DisplayPanel.js';
import DivaView from '../src/DivaView.js';
import SingleView from '../src/SingleView/SingleView.js';
import DivaEdit from '../src/SquareEdit/DivaEditMode.js';
import SingleEditMode from '../src/SquareEdit/SingleEditMode.js';
import InfoModule from '../src/InfoModule.js';
import TextView from '../src/TextView.js';

import PouchDb from 'pouchdb';

let name = getGetParam('manifest');
let manifestLocation = 'manifests/' + name + '.jsonld';
let storage = getGetParam('storage');

if (name) {
  window.fetch(manifestLocation).then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error(response.statusText);
    }
  }).then(async text => {
    let manifest = JSON.parse(text);
    let params = {
      manifest: manifest,
      Display: DisplayPanel,
      Info: InfoModule,
      TextView: TextView
    };
    // Determine if it is a single page or multiple by media type
    let mediaType = await new Promise((resolve, reject) => {
      window.fetch(manifest.image).then(response => {
        resolve(response.headers.get('Content-Type'));
      }).catch(err => {
        reject(err);
      });
    });
    if (mediaType.match(/image\/*/)) {
      params.View = SingleView;
      params.NeumeEdit = SingleEditMode;
    } else {
      params.View = DivaView;
      params.NeumeEdit = DivaEdit;
    }

    var view = new NeonView(params);
    view.start();
  });
} else {
  let db = new PouchDb('Neon-User-Storage');
  db.getAttachment(storage, 'manifest').then(blob => {
    return new window.Response(blob).json();
  }).then(async manifest => {
    console.log(manifest);
    let params = {
      manifest: manifest,
      Display: DisplayPanel,
      Info: InfoModule,
      TextView: TextView
    };

    let mediaType = await new Promise((resolve, reject) => {
      window.fetch(manifest.image).then(response => {
        resolve(response.headers.get('Content-Type'));
      }).catch(err => {
        reject(err);
      });
    });
    if (mediaType.match(/image\/*/)) {
      params.View = SingleView;
      params.NeumeEdit = SingleEditMode;
    } else {
      params.View = DivaView;
      params.NeumeEdit = DivaEdit;
    }

    var view = new NeonView(params);
    view.start();
  });
}

function getGetParam (paramName) {
  let result = null;

  let tmp = [];
  window.location.search
    .substr(1)
    .split('&')
    .forEach((item) => {
      tmp = item.split('=');
      if (tmp[0] === paramName) {
        result = decodeURIComponent(tmp[1]);
      }
    });
  return result;
}
