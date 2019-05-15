import NeonView from './NeonView.js';
// import DisplayPanel from './SingleView/DisplayPanel.js';
import DisplayPanel from './DisplayPanel/DisplayPanel.js';
import DivaView from './DivaView/DivaView.js';
import SingleView from './SingleView/SingleView.js';
import SingleEditMode from './SingleEdit/SingleEditMode.js';
import InfoModule from './InfoModule.js';

const $ = require('jquery');

if (manifest !== '') {
  var page18, page20, page22;
  $.get('https://ddmal.github.io/Neon2/mei/CF-017.mei').then((data17) => {
    page18 = data17;
    $.get('https://ddmal.github.io/Neon2/mei/CF-018.mei').then((data18) => {
      page20 = data18;
      $.get('https://ddmal.github.io/Neon2/mei/CF-019.mei').then((data19) => {
        page22 = data19;
        $.get(manifest).then((data) => {
          let map = new Map();
          map.set(18, page18);
          map.set(20, page20);
          map.set(22, page22);

          let params = {
            mode: 'iiif',
            options: {
              manifest: manifest,
              meiMap: map,
              name: data.label
            },
            View: DivaView,
            Display: DisplayPanel,
            Info: InfoModule
            // Edit: DivaEditMode
          };
          var view = new NeonView(params);
          view.start();
        });
      });
    });
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
      Edit: SingleEditMode
    };

    var view = new NeonView(params);
    view.start();
  });
}
