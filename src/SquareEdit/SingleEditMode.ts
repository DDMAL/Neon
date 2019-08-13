import { bindInsertTabs, initInsertEditControls, initEditModeControls, initSelectionButtons } from './Controls';
import { setHighlightSelectionControls } from '../DisplayPanel/DisplayControls';
import * as Select from '../utils/Select';
import InsertHandler from './InsertHandler';
import NeonView from '../NeonView';
import * as SelectOptions from './SelectOptions';
import DragHandler from '../utils/DragHandler';

/**
 * An Edit Module for a single page of a manuscript.
 * Works with the SingleView module.
 */
class SingleEditMode {
  neonView: NeonView;
  dragHandler: DragHandler;
  insertHandler: any;
  /**
   * Constructor for an EditMode object.
   * @param {NeonView} neonView - The NeonView parent.
   */
  constructor (neonView: NeonView) {
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
    document.getElementById('primitiveTab').click();
    Select.setSelectHelperObjects(this.neonView, this.dragHandler);
    this.setSelectListeners();

    SelectOptions.initNeonView(this.neonView);
    initInsertEditControls(this.neonView);
    let editMenu = document.getElementById('editMenu');
    editMenu.style.backgroundColor = '#ffc7c7';
    editMenu.style.fontWeight = 'bold';

    initSelectionButtons();

    setHighlightSelectionControls();

    this.neonView.view.addUpdateCallback(this.setSelectListeners.bind(this));
  }

  /**
   * Get the user mode that Neon is in. Either insert, edit, or viewer.
   * @returns {string}
   */
  getUserMode (): string {
    if (this.insertHandler !== undefined) {
      if (this.insertHandler.isInsertMode()) {
        return 'insert';
      }
      return 'edit';
    }
    return 'viewer';
  }

  setSelectListeners () {
    Select.clickSelect('#mei_output, #mei_output use, #mei_output rect');
    Select.dragSelect('#svg_group');
  }
}

export { SingleEditMode as default };
