import * as Notification from '../utils/Notification';
import NeonView from '../NeonView';
import { SplitAction } from '../Types';
import { selectAll } from '../utils/SelectTools';
import DragHandler from '../utils/DragHandler';
import { getSVGRelCoords } from '../utils/Coordinates';

/** Handle splitting a staff into two staves through Verovio. */
export class SplitStaffHandler {
  readonly neonView: NeonView;
  readonly staff: SVGGElement;

  /**
   * @param staff - The staff that will be modified.
   */
  constructor (neonView: NeonView, staff: SVGGElement) {
    this.neonView = neonView;
    this.staff = staff;
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

    Notification.queueNotification('Click Where to Split');
  }

  splitDisable (): void {
    document.body.removeEventListener('keydown', this.keydownListener);
    document.body.removeEventListener('keyup', this.resetHandler);
    document.body.removeEventListener('click', this.clickawayHandler);
    document.body.removeEventListener('click', this.handler, { capture: true });
  }

  /** Handle input to split a staff. */
  handler = ((evt: MouseEvent): void => {
    // Find staff point corresponds to if one exists
    // TODO
    const id = this.staff.id;
    const cursor = getSVGRelCoords(evt.clientX, evt.clientY);
    const editorAction: SplitAction = {
      action: 'split',
      param: {
        elementId: id,
        x: cursor.x
      }
    };

    this.neonView.edit(editorAction, this.neonView.view.getCurrentPageURI()).then(async (result) => {
      if (result) {
        await this.neonView.updateForCurrentPage();
        Notification.queueNotification('Split action successful', 'success');
      }
      const dragHandler = new DragHandler(this.neonView, '.staff');
      this.splitDisable();
      selectAll([document.querySelector(`#${id}`)], this.neonView, dragHandler);

      const moreEdit = document.getElementById('moreEdit');
      if (moreEdit) {
        moreEdit.innerHTML = '';
        moreEdit.parentElement.classList.add('hidden');
      }
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
