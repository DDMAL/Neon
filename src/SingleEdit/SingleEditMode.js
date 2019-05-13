import * as Controls from '../utils/Controls.js';
import DragHandler from '../SingleView/DragHandler.js';
import * as Select from './Select.js';
import InsertHandler from './InsertHandler.js';
import * as SelectOptions from './SelectOptions.js';

export default class EditMode {
  constructor (neonView) {
    this.neonView = neonView;
    Controls.initEditMode(this);
  }

  initEditMode () {
    this.dragHandler = new DragHandler(this.neonView);
    // Controls.initNavbar(this.neonView.name);
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
