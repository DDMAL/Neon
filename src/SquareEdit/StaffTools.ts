import * as Notification from '../utils/Notification';
import NeonView from '../NeonView';
import { EditorAction } from '../Types';

/**
 * Handler splitting a staff into two staves through Verovio.
 * @constructor
 */
function SplitHandler (neonView: NeonView): void {
  function startSplit (): void {
    splitDisable();

    document.body.addEventListener('click', handler);

    // Handle keypresses
    document.body.addEventListener('keydown', keydownListener);
    document.body.addEventListener('keyup', resetHandler);
    document.body.addEventListener('click', clickawayHandler);

    Notification.queueNotification('Click Where to Split');
  }

  function keydownListener (evt: KeyboardEvent): void {
    if (evt.key === 'Escape') {
      splitDisable();
    } else if (evt.key === 'Shift') {
      document.body.removeEventListener('click', handler);
    }
  }

  function clickawayHandler (evt: MouseEvent): void {
    console.log(evt);
    if ((evt.target as HTMLElement).closest('.active-page') === null) {
      splitDisable();
      document.body.removeEventListener('click', handler);
    }
  }

  function resetHandler (evt: KeyboardEvent): void {
    if (evt.key === 'Shift') {
      document.body.addEventListener('click', handler);
    }
  }

  function handler (evt: MouseEvent): void {
    const id = document.querySelector('.selected').id;

    const container = document.getElementsByClassName('active-page')[0]
      .getElementsByClassName('definition-scale')[0] as SVGSVGElement;
    const pt = container.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;

    // Transform to SVG coordinate system.
    const transformMatrix = (container.getElementsByClassName('system')[0] as SVGGElement)
      .getScreenCTM().inverse();
    const cursorPt = pt.matrixTransform(transformMatrix);
    console.log(cursorPt.x);
    // Find staff point corresponds to if one exists
    // TODO

    const editorAction: EditorAction = {
      'action': 'split',
      'param': {
        'elementId': id,
        'x': cursorPt.x
      }
    };

    neonView.edit(editorAction, neonView.view.getCurrentPageURI()).then(async (result) => {
      if (result) {
        await neonView.updateForCurrentPagePromise();
      }
      splitDisable();
    });
  }

  function splitDisable (): void {
    document.body.removeEventListener('keydown', keydownListener);
    document.body.removeEventListener('keyup', resetHandler);
    document.body.removeEventListener('click', clickawayHandler);
    document.body.removeEventListener('click', handler);
  }

  SplitHandler.prototype.constructor = SplitHandler;
  SplitHandler.prototype.startSplit = startSplit;
}

export { SplitHandler };
