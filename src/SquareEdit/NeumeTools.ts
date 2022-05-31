import * as Notification from '../utils/Notification';
import NeonView from '../NeonView';
import { EditorAction, SplitNeumeAction } from '../Types';

/** Handle splitting a neume into two neumes through Verovio. */
export class SplitNeumeHandler {
  readonly neonView: NeonView;
  readonly neume: SVGGElement;

  /**
   * @param neume - The neume that will be modified.
   */
  constructor (neonView: NeonView, neume: SVGGElement) {
    this.neonView = neonView;
    this.neume = neume;
  }

  /**
   * First part of the split action.
   */
  startSplit (): void {
    this.splitDisable();

    document.body.addEventListener('click', this.handler, { capture: true });

    // Handle keypresses
    document.body.addEventListener('keydown', this.keydownListener);
    document.body.addEventListener('keyup', this.resetHandler);
    document.body.addEventListener('click', this.clickawayHandler);

    Notification.queueNotification('Click The Beginning of The Second Neume');
  }

  splitDisable (): void {
    document.body.removeEventListener('keydown', this.keydownListener);
    document.body.removeEventListener('keyup', this.resetHandler);
    document.body.removeEventListener('click', this.clickawayHandler);
    document.body.removeEventListener('click', this.handler, { capture: true });
  }

  /** Handle input to split a neume. */
  handler = ((evt: MouseEvent): void => {
    const id = this.neume.id;

    // unselect();
    
    const nc = (evt.target as SVGGElement).parentElement;
    const ncId = nc.id;

    const editorAction: SplitNeumeAction = {
      action: 'splitNeume',
      param: {
        elementId: id,
        ncId: ncId
      }
    };

    this.neonView.edit(editorAction, this.neonView.view.getCurrentPageURI()).then(async (result) => {
      if (result) {
        await this.neonView.updateForCurrentPage();
        Notification.queueNotification('Split action successful');
      } 
      else {
        await this.neonView.updateForCurrentPage();
        Notification.queueNotification('Split action failed');
      }
      // this.neonView.updateForCurrentPage();
      // const dragHandler = new DragHandler(this.neonView, '.neume');
      this.splitDisable();
      // selectAll([document.querySelector('#' + id) as SVGGElement], this.neonView, dragHandler);
      // try {
      //   document.getElementById('moreEdit').innerHTML = '';
      //   document.getElementById('moreEdit').classList.add('is-hidden');
      // } catch (e) {}
    });
  }).bind(this);

  /** Exits split on Escape press, disables on Shift. */
  keydownListener = ((evt: KeyboardEvent): void => {
    if (evt.key === 'Escape') {
      this.splitDisable();
    } else if (evt.key === 'Shift') {
      document.body.removeEventListener('click', this.handler, { capture: true });
    }
  }).bind(this);

  /** Exit split if user clicks off of active page. */
  clickawayHandler = ((evt: MouseEvent): void => {
    const target = evt.target as HTMLElement;
    if (target.closest('.active-page') === null) {
      this.splitDisable();
      document.body.removeEventListener('click', this.handler, { capture: true });
    }
  }).bind(this);

  /** Called to reapply the event listener if necessary. */
  resetHandler = ((evt: KeyboardEvent): void => {
    if (evt.key === 'Shift') {
      document.body.addEventListener('click', this.handler, { capture: true });
    }
  }).bind(this);
}
