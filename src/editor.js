import NeonView from './NeonView.js';
import DisplayPanel from './DisplayPanel.js';
import SingleView from './SingleView.js';

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
  };

  var view = new NeonView(params);
  view.start();
});
