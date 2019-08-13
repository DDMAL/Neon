import NeonView from './NeonView';
import DisplayPanel from './DisplayPanel/DisplayPanel';
import DivaView from './DivaView';
import DivaEdit from './SquareEdit/DivaEditMode';
import SingleView from './SingleView/SingleView';
import SingleEditMode from './SquareEdit/SingleEditMode';
import InfoModule from './InfoModule';
import TextView from './TextView';
import TextEditMode from './TextEditMode';

declare var manifestText: string;

var view: NeonView;
init();

async function init () {
  if (manifestText !== '') {
    let manifest = JSON.parse(manifestText);
    let params = {
      manifest: manifest,
      Display: DisplayPanel,
      Info: InfoModule,
      TextView: TextView,
      TextEdit: TextEditMode,
      View: undefined,
      NeumeEdit: undefined
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
