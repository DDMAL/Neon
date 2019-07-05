import { bindInsertTabs, initInsertEditControls, initEditModeControls, initSelectionButtons } from './Controls.js';
import * as Select from '../utils/Select.js';
import InsertHandler from './InsertHandler.js';
import * as SelectOptions from './SelectOptions.js';
import DragHandler from '../utils/DragHandler.js';

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
    this.insertHandler = new InsertHandler(this.neonView, '#svg_group');
    bindInsertTabs(this.insertHandler);
    document.getElementById('neumeTab').click();
    Select.setSelectHelperObjects(this.neonView, this.dragHandler);
    this.setSelectListeners();

    SelectOptions.initNeonView(this.neonView);
    initInsertEditControls(this.neonView);
    let editMenu = document.getElementById('editMenu');
    editMenu.style.backgroundColor = '#ffc7c7';
    editMenu.style.fontWeight = 'bold';

    this.neonView.view.addUpdateCallback(this.setSelectListeners.bind(this));
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

  setSelectListeners () {
    Select.clickSelect('#mei_output, #mei_output use');
    Select.dragSelect('#svg_group');
    initSelectionButtons();
  }
}

export { SingleEditMode as default };
