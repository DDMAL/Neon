import NeonView from './NeonView.js';
import DisplayPanel from './SingleView/DisplayPanel.js';
import SingleView from './SingleView/SingleView.js';
import SingleEditMode from './SingleEdit/SingleEditMode.js';
import InfoModule from './InfoModule.js';

const $ = require('jquery');

$.get(meiFile, (data) => {
  let map = new Map();
  map.set(0, data);
  let params = {
    mode: 'single',
    options: {
      image: bgImg,
      meiMap: map,
      name: 'test'
    },
    View: SingleView,
    Display: DisplayPanel,
    Info: InfoModule,
    Edit: SingleEditMode
  };

  var view = new NeonView(params);
  view.start();
});
