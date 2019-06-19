import NeonView from '../src/NeonView.js';
import DisplayPanel from '../src/DisplayPanel/DisplayPanel.js';
import DivaView from '../src/DivaView.js';
import SingleView from '../src/SingleView/SingleView.js';
import SingleEditMode from '../src/SquareEdit/SingleEditMode.js';
import InfoModule from '../src/InfoModule.js';
import TextView from '../src/TextView.js';

import PouchDb from 'pouchdb';
const $ = require('jquery');

let mei = getGetParam('page');
let mode = getGetParam('mode');
let map = new Map();

// Since in local mode there are no GET parameters, mei will be null
if (mode === 'demo-page') {
  console.log('Demo page');
  $.get('./mei/' + mei + '.mei', (data) => {
    map.set(0, data);
    let params = {
      mode: 'single',
      options: {
        image: './img/' + mei + '.png',
        meiMap: map,
        name: mei
      },
      View: SingleView,
      Display: DisplayPanel,
      Info: InfoModule,
      NeumeEdit: SingleEditMode,
      TextView: TextView
    };

    var view = new NeonView(params);
    view.start();
  });
} else if (mode === 'demo-iiif') {
  console.log('IIIF');
  let params = {
    mode: 'iiif',
    options: {
      manifest: 'https://images.simssa.ca/iiif/manuscripts/cdn-hsmu-m2149l4/manifest.json'
    },
    View: DivaView,
    Display: DisplayPanel,
    Info: InfoModule,
    TextView: TextView
  };
  if (mei === 'Salzinnes') {
    console.log('Salzinnes');
    $.get('https://images.simssa.ca/iiif/manuscripts/cdn-hsmu-m2149l4/manifest.json').then((manifest) => {
      params.options.name = manifest.label;
      console.log(manifest);
      return $.get('./mei/CF-017.mei');
    }).then((data) => {
      console.log(18);
      map.set(18, data);
      return $.get('./mei/CF-018.mei');
    }).then((data) => {
      console.log(20);
      map.set(20, data);
      return $.get('./mei/CF-019.mei');
    }).then((data) => {
      map.set(22, data);
      console.log(22);
      params.options.meiMap = map;
      var view = new NeonView(params);
      view.start();
    });
  }
} else if (mode === 'user-page') {
  let db = new PouchDb('neon-temporary');
  let params = {
    mode: 'single',
    options: {
      name: 'User MEI'
    },
    View: SingleView,
    Edit: SingleEditMode,
    Display: DisplayPanel,
    Info: InfoModule,
    TextView: TextView
  };
  db.get('mei').then((doc) => {
    map.set(0, doc.data);
    params.options.meiMap = map;
    return db.get('img');
  }).then((doc) => {
    params.options.image = doc.data;
    var view = new NeonView(params);
    view.start();
  }).catch((err) => {
    console.error(err);
  });
} else {
  console.log('None of the above');
}

/*
var view;
if (mei === null) {
  view = new NeonView({
    meifile: '',
    bgimg: '',
    mode: 'local',
    raw: 'true'
  });
} else {
  view = new NeonView({
    meifile: './mei/' + mei + '.mei',
    bgimg: './img/' + mei + '.png',
    mode: 'pages'
  });
}

view.start();
*/

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
