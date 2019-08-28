import NeonView from '../../src/NeonView';
import DisplayPanel from '../../src/DisplayPanel/DisplayPanel';
import DivaView from '../../src/DivaView';
import DivaEdit from '../../src/SquareEdit/DivaEditMode';
import SingleView from '../../src/SingleView/SingleView';
import SingleEditMode from '../../src/SquareEdit/SingleEditMode';
import InfoModule from '../../src/InfoModule';
import TextView from '../../src/TextView';
import TextEditMode from '../../src/TextEditMode';
import { NeonManifest } from '../../src/Types';

declare let manifestText: string;

let view: NeonView;

async function init (): Promise<void> {
  if (manifestText !== '') {
    const manifest: NeonManifest = JSON.parse(manifestText);
    const params = {
      manifest: manifest,
      Display: DisplayPanel,
      Info: InfoModule,
      TextView: TextView,
      TextEdit: TextEditMode,
      View: undefined,
      NeumeEdit: undefined
    };
    const mediaType = await window.fetch(manifest.image).then(response => {
      if (response.ok) {
        return response.headers.get('Content-Type');
      } else {
        throw new Error(response.statusText);
      }
    });

    const singlePage = mediaType.match(/^image\/*/);
    params.View = singlePage ? SingleView : DivaView;
    params.NeumeEdit = singlePage ? SingleEditMode : DivaEdit;

    view = new NeonView(params);
    view.start();
  }
}

init();
