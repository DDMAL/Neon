import { bindInsertTabs, initEditModeControls, initNavbar, initInsertEditControls } from '../UnifiedEdit/EditControls.js';
import DragHandler from './DragHandler.js';
import * as Select from '../UnifiedEdit/Select.js';
import InsertHandler from '../UnifiedEdit/InsertHandler.js';
import * as SelectOptions from '../UnifiedEdit/SelectOptions.js';

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
    initEditModeControls(this);
  }

  /**
   * Initialize the start of edit mode when first leaving viewer mode.
   */
  initEditMode () {
    this.dragHandler = new DragHandler(this.neonView, '#svg_group');
    initNavbar(this.neonView);
    Select.setSelectHelperObjects(this.neonView, this.dragHandler);
    Select.clickSelect('#mei_output, #mei_output use');

    this.insertHandler = new InsertHandler(this.neonView, '#svg_group');
    bindInsertTabs(this.insertHandler);
    document.getElementById('neumeTab').click();
    Select.dragSelect('#svg_group');

    SelectOptions.initNeonView(this.neonView);
    initInsertEditControls(this.neonView);
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
