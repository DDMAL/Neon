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
      options: {
        manifest: manifest,
        meiMap: meiMap,
        name: data.label
      },
      View: DivaView,
      Display: DisplayPanel,
      Info: InfoModule,
      NeumeEdit: DivaEdit,
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
      manifest: {
        title: 'test',
        timestamp: Date.now(),
        image: bgImg,
        mei_annotations: [
          {
            '@context': 'http://www.w3.org/ns/anno.jsonld',
            id: '#test-id',
            type: 'Annotation',
            body: meiFile,
            target: bgImg
          }
        ]
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
}
