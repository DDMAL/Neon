import NeonView from '../NeonView';
import { EditorAction, InsertAction } from '../Types';
import * as d3 from 'd3';
import { getSVGRelCoords, isOutOfSVGBounds, Point } from '../utils/Coordinates';
import { queueNotification } from '../utils/Notification';
import { setSettings } from '../utils/LocalSettings';

/**
 * Class that handles insert mode, events, and actions.
 */
class InsertHandler {
  type: string;
  firstClick = true;
  coord: Point;
  attributes: Record<string, string>;
  selector: string;
  neonView: NeonView;

  /**
   * @param neonView - NeonView parent.
   * @param sel - The CSS selector to apply insert listeners to.
   */
  constructor (neonView: NeonView, sel: string) {
    this.neonView = neonView;
    this.selector = sel;
  }

  /**
   * Called when an insert button is clicked.
   * Triggers the start of insert mode.
   * @param buttonId - The ID of the button that was clicked.
   */
  insertActive (buttonId: string): void {
    const alreadyInInsertMode = this.isInsertMode();
    switch (buttonId) {
      case 'punctum':
        this.type = 'nc';
        this.attributes = null;
        break;
      case 'diamond':
        this.type = 'nc';
        this.attributes = { tilt: 'se' };
        break;
      case 'virga':
        this.type = 'nc';
        this.attributes = { tilt: 's' };
        break;
      //there are multiple possible liquescent combinations
      case 'liquescentA':
        this.type = 'nc';
        this.attributes = { curve: 'a' };
        break;
      case 'liquescentC':
        this.type = 'nc';
        this.attributes = { curve: 'c' };
        break;
      case 'virgaReversed':
        this.type = 'nc';
        this.attributes = { tilt: 'n' };
        break;
      case 'pes':
      case 'clivis':
      case 'scandicus':
      case 'climacus':
      case 'torculus':
      case 'porrectus':
      case 'pressus':
        const contour = this.neonView.info.getContourByValue(
          buttonId.charAt(0).toUpperCase() + buttonId.slice(1)
        );
        this.type = 'grouping';
        this.attributes = { contour: contour };
        break;
      case 'cClef':
      case 'fClef':
        this.type = 'clef';
        this.attributes = { shape: buttonId.charAt(0).toUpperCase() };
        break;
      case 'custos':
        this.type = 'custos';
        this.attributes = null;
        break;
      case 'divLineMaxima':
        this.type = 'divLine';
        this.attributes = { form: 'maxima' };
        break;
      case 'staff':
        this.type = 'staff';
        this.attributes = null;
        break;
      case 'flat':
        this.type = 'accid';
        this.attributes = { accid: 'f' };
        break;
      case 'natural':
        this.type = 'accid';
        this.attributes = { accid: 'n' };
        break;
      default:
        this.type = '';
        this.attributes = null;
        console.error('Invalid button for insertion: ' + buttonId + '.');
        return;
    }

    this.removeInsertClickHandlers();
    try {
      if (this.type === 'staff') {
        document.querySelector(this.selector)
          .addEventListener('click', this.staffHandler);
      } else {
        document.querySelector(this.selector)
          .addEventListener('click', this.handler);
      }
    } catch (e) {}

    // Disable edit mode listeners
    document.body.addEventListener('keydown', this.keydownListener);
    document.body.addEventListener('keyup', this.resetInsertHandler);

    // Add 'return to edit mode' button
    if (!alreadyInInsertMode) {
      const editModeButton = document.createElement('button');
      editModeButton.id = 'returnToEditMode';
      editModeButton.classList.add('side-panel-btn');
      editModeButton.innerHTML = 'Return to Edit Mode';
      document.getElementById('redo').parentNode.appendChild(editModeButton);
      editModeButton.addEventListener('click', this.insertDisabled);
    }

    document.getElementById('editContents').addEventListener('click', this.clickawayHandler);
  }

  /**
   * Disable insert mode and remove event listeners.
   */
  insertDisabled = (function insertDisabled (): void {
    this.type = '';
    this.removeInsertClickHandlers();
    document.body.removeEventListener('keydown', this.keydownListener);
    document.body.removeEventListener('keyup', this.resetInsertHandler);
    document.body.removeEventListener('click', this.clickawayHandler);

    this.firstClick = true;
    try {
      document.getElementById('returnToEditMode').remove();
    } catch (e) {
      // console.debug(e);
    }

    const insertPanel = document.getElementById('insert_controls');
    const insertHeading = document.getElementById('insertMenu');
    const insertHeadingTitle = insertHeading.querySelector('.panel-heading-title');

    const editPanel = document.getElementById('edit_controls');
    const editHeading = document.getElementById('editMenu');
    const displayHeadingTitle = editHeading.querySelector('.panel-heading-title');

    insertHeadingTitle.classList.remove('focused');
    displayHeadingTitle.classList.add('focused');

    insertPanel.querySelector('.side-panel-btn.insertel.is-active').classList.add('unfocused');
    editPanel.querySelector('.side-panel-btn.sel-by.is-active').classList.remove('unfocused');

    setSettings({ userMode: 'edit' });
    
  }).bind(this);

  /**
   * Event handler to handle a user clicking away from the active page
   * causing insert mode to end.
   */
  clickawayHandler = (function clickawayHandler (evt: MouseEvent): void {
    const target = evt.target as HTMLElement;
    if (target.closest('.active-page') === null &&
      target.closest('#insert_controls') === null &&
      target.closest('#svg_group') === null) {
      this.insertDisabled();
      document.body.removeEventListener('keydown',
        this.staffHandler);
      document.body.removeEventListener('keydown',
        this.handler);
    }
  }).bind(this);

  /**
   * Resets an insert event listener after temporarily removing it.
   */
  resetInsertHandler = (function resetInsertHandler (evt: KeyboardEvent): void {
    if (evt.key === 'Shift') {
      document.querySelector(this.selector)
        .addEventListener('click', this.type === 'staff' ?
          this.staffHandler : this.handler);
    }
  }).bind(this);

  /**
   * Listens to key presses to either exit edit mode (if Escape) or
   * temporarily remove insert event listeners (if Shift).
   */
  keydownListener = (function keydownListener (evt: KeyboardEvent): void {
    if (evt.key === 'Escape') {
      this.insertDisabled();
      document.body.removeEventListener('keydown', this.staffHandler);
      document.body.removeEventListener('keydown', this.handler);
    } else if (evt.key === 'Shift') {
      this.removeInsertClickHandlers();
    }
  }).bind(this);

  /**
   * Event handler for clicking to insert any element except a staff.
   */
  handler = (function handler (evt: MouseEvent): void {
    evt.stopPropagation();

    // If the cursor is out of bounds, nothing should be inserted.
    const cursor = getSVGRelCoords(evt.clientX, evt.clientY);
    if (isOutOfSVGBounds(cursor.x, cursor.y))
      return queueNotification('[FAIL] Glyph was placed out of bounds! Insertion failed.', 'error');

    const editorAction: InsertAction = {
      action: 'insert',
      param: {
        elementType: this.type,
        staffId: 'auto',
        ulx: cursor.x,
        uly: cursor.y,
      }
    };

    if (this.attributes !== null) {
      editorAction.param.attributes = this.attributes;
      if (this.attributes['shape'] === 'F') {
        editorAction['param']['ulx'] -= 50;
      }
    }

    this.neonView.edit(editorAction, this.neonView.view.getCurrentPageURI()).then(() => {
      return this.neonView.updateForCurrentPage();
    }).then(() => {
      document.querySelector(this.selector).addEventListener('click', this.handler);
    });
  }).bind(this);

  /**
   * Event handler to insert a staff.
   */
  staffHandler = (function staffHandler (evt: MouseEvent): void {
    const cursor = getSVGRelCoords(evt.clientX, evt.clientY);

    if (isOutOfSVGBounds(cursor.x, cursor.y)) {
      return queueNotification('Staff cannot be placed out of bounds!', 'error');
    }

    const container = document.querySelector('.active-page > .definition-scale');

    if (this.firstClick) {
      this.coord = cursor;
      d3.select(container).append('circle').attr('cx', cursor.x)
        .attr('cy', cursor.y)
        .attr('r', 10)
        .attr('id', 'staff-circle')
        .attr('fill', 'green');
      this.firstClick = false;
    } else {
      let ul: Point, lr: Point;
      if (cursor.x < this.coord.x || cursor.y < this.coord.y) { // second point is not lr
        ul = cursor;
        lr = this.coord;
      } else {
        ul = this.coord;
        lr = cursor;
      }
      document.getElementById('staff-circle').remove();
      const action: EditorAction = {
        action: 'insert',
        param: {
          elementType: 'staff',
          staffId: 'auto',
          ulx: ul.x,
          uly: ul.y,
          lrx: lr.x,
          lry: lr.y
        }
      };

      this.neonView.edit(action, this.neonView.view.getCurrentPageURI()).then(() => {
        this.neonView.updateForCurrentPage();
        this.firstClick = true;
      });
    }
  }).bind(this);

  /**
   * Remove the insert listeners while not leaving insert mode entirely.
   */
  removeInsertClickHandlers = (function removeInsertClickHandlers (): void {
    try {
      document.querySelector(this.selector).removeEventListener('click', this.staffHandler);
      document.querySelector(this.selector).removeEventListener('click', this.handler);
    } catch (e) {}
  }).bind(this);

  isInsertMode (): boolean {
    return (this.type !== '');
  }
}

export { InsertHandler as default };
