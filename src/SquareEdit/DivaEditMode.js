import { bindInsertTabs, initInsertEditControls } from './Controls.js';
import { initEditModeControls } from '../utils/EditControls.js';
import * as Select from '../utils/Select.js';
import InsertHandler from './InsertHandler.js';
import * as SelectOptions from './SelectOptions.js';

class DivaEdit {
  constructor (neonView) {
    this.neonView = neonView;
    initEditModeControls(this);
  }

  initEditMode () {
    this.insertHandler = new InsertHandler(this.neonView, '.active-page > svg');
    bindInsertTabs(this.insertHandler);
    document.getElementById('neumeTab').click();
    this.setSelectListeners();

    SelectOptions.initNeonView(this.neonView);
    initInsertEditControls(this.neonView);
    let editMenu = document.getElementById('editMenu');
    editMenu.style.backgroundColor = '#ffc7c7';
    editMenu.style.fontWeight = 'bold';

    Select.setSelectStrokeWidth(1);

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
    Select.clickSelect('.active-page, .active-page use');
    Select.dragSelect('.active-page svg');
  }
}

export { DivaEdit as default };
