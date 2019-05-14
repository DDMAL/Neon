import * as Controls from '../utils/Controls.js';
import DragHandler from '../SingleView/DragHandler.js';
import * as Select from './Select.js';
import InsertHandler from './InsertHandler.js';
import * as SelectOptions from './SelectOptions.js';

/**
 * An Edit Module for a single page of a manuscript.
 * Works with the SingleView module.
 */
class SingleEditMode {
  /**
   * Constructor for an EditMode object.
   * @param {NeonView} neonView - The NeonView parent.
   */
  constructor (neonView) {
    this.neonView = neonView;
    Controls.initEditMode(this);
  }

  /**
   * Initialize the start of edit mode when first leaving viewer mode.
   */
  initEditMode () {
    this.dragHandler = new DragHandler(this.neonView);
    Controls.initNavbar(this.neonView);
    Select.setSelectHelperObjects(this.dragHandler, this.neonView);
    Select.clickSelect();
    this.insertHandler = new InsertHandler(this.neonView);
    Controls.bindInsertTabs(this.insertHandler);
    document.getElementById('neumeTab').click();
    Select.dragSelect();
    SelectOptions.initNeonView(this.neonView);
    Controls.initInsertEditControls(this.neonView);
    let editMenu = document.getElementById('editMenu');
    editMenu.style.backgroundColor = '#ffc7c7';
    editMenu.style.fontWeight = 'bold';
  }

  /**
   * Get the user mode that Neon is in. Either insert, edit, or viewer.
   * @returns {string}
   */
  getUserMode () {
    if (this.insertHandler !== undefined) {
      if (this.insertHandler.isInsertMode()) {
        return 'insert';
      }
      return 'edit';
    }
    return 'viewer';
  }
}

export { SingleEditMode as default };
