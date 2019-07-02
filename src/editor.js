import NeonView from './NeonView.js';
import DisplayPanel from './DisplayPanel/DisplayPanel.js';
import DivaView from './DivaView.js';
import DivaEdit from './SquareEdit/DivaEditMode.js';
import SingleView from './SingleView/SingleView.js';
import SingleEditMode from './SquareEdit/SingleEditMode.js';
import InfoModule from './InfoModule.js';
import TextView from './TextView.js';
import TextEditMode from './TextEditMode.js';

var view;
init();

async function init () {
  if (manifestText !== '') {
    let manifest = JSON.parse(manifestText);
    let params = {
      manifest: manifest,
      Display: DisplayPanel,
      Info: InfoModule,
      TextView: TextView
    };
    let mediaType = await window.fetch(manifest.image).then(response => {
      if (response.ok) {
        return response.headers.get('Content-Type');
      } else {
        throw new Error(response.statusText);
      }
    });

    let singlePage = mediaType.match(/^image\/*/);
    params.View = singlePage ? SingleView : DivaView;
    params.NeumeEdit = singlePage ? SingleEditMode : DivaEdit;

    view = new NeonView(params);
    view.start();
  }
}
