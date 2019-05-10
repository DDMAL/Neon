import * as Controls from './Controls.js';
import DragHandler from './DragHandler.js';
import { ClickSelect, DragSelect } from './Select.js';
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
    this.clickSelect = new ClickSelect(
      this.dragHandler,
      this.neonView.view.displayPanel.zoomHandler,
      this.neonView,
      this.neonView.core,
      this.neonView.InfoModule
    );
    this.insertHandler = new InsertHandler(this.neonView);
    Controls.bindInsertTabs(this.insertHandler);
    document.getElementById('neumeTab').click();
    this.dragSelect = new DragSelect(
      this.dragHandler,
      this.neonView.view.displayPanel.zoomHandler,
      this.neonView,
      this.neonView.core,
      this.neonView.InfoModule
    );
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
