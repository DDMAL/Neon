import NeonView from './NeonView.js';
import DisplayPanel from './DisplayPanel/DisplayPanel.js';
import DivaView from './DivaView.js';
import DivaEdit from './SquareEdit/DivaEditMode.js';
import SingleView from './SingleView/SingleView.js';
import SingleEditMode from './SquareEdit/SingleEditMode.js';
import InfoModule from './InfoModule.js';
import TextView from './TextView.js';

const $ = require('jquery');

if (manifest !== '') {
  $.get(manifest).then((data) => {
    let params = {
      mode: 'iiif',
      options: {
        manifest: manifest,
        meiMap: meiMap,
        name: data.label
      },
      View: DivaView,
      Display: DisplayPanel,
      Info: InfoModule,
      Edit: DivaEdit,
      TextView: TextView
    };
    var view = new NeonView(params);
    view.start();
  });
} else {
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
      Edit: SingleEditMode,
      TextView: TextView
    };

    var view = new NeonView(params);
    view.start();
  });
}
