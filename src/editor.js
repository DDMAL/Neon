import NeonView from './NeonView.js';
import DisplayPanel from './DisplayPanel.js';
import SingleView from './SingleView.js';
import SingleEditMode from './SingleEditMode.js';
import InfoModule from './InfoModule.js';

const $ = require('jquery');

$.get(meiFile, (data) => {
  let params = {
    mode: 'single',
    options: {
      image: bgImg,
      meiMap: data
    },
    View: SingleView,
    Display: DisplayPanel,
    Info: InfoModule,
    Edit: SingleEditMode
  };

  var view = new NeonView(params);
  view.start();
});
