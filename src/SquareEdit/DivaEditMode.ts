import { bindInsertTabs, initInsertEditControls, initSelectionButtons } from './Controls';
import * as Select from '../utils/Select';
import InsertHandler from './InsertHandler';
import NeonView from '../NeonView';
import * as SelectOptions from './SelectOptions';
import { setHighlightSelectionControls } from '../DisplayPanel/DisplayControls';
import DragHandler from '../utils/DragHandler';
import { NeumeEditInterface } from '../Interfaces';
import * as Contents from './Contents';
import { undoRedoPanel } from '../utils/EditContents';
import { getSettings } from '../utils/LocalSettings';
import { UserType } from '../Types';

class DivaEdit implements NeumeEditInterface {
  neonView: NeonView;
  dragHandler: DragHandler;
  insertHandler: InsertHandler;
  constructor (neonView: NeonView) {
    this.neonView = neonView;
    this.initEditMode();
  }

  initEditMode (): void {
    document.getElementById('insert_controls').innerHTML += Contents.insertControlsPanel;
    document.getElementById('edit_controls').innerHTML += Contents.editControlsPanel;
    document.getElementById('undoRedo_controls').innerHTML = undoRedoPanel;

    this.dragHandler = new DragHandler(this.neonView, '.active-page > svg');
    this.insertHandler = new InsertHandler(this.neonView, '.active-page > svg');
    bindInsertTabs(this.insertHandler);
    const { insertTab } = getSettings();
    document.getElementById(insertTab).click();
    Select.setSelectHelperObjects(this.neonView, this.dragHandler);
    this.setSelectListeners();
    SelectOptions.initNeonView(this.neonView);
    initInsertEditControls();
    Select.setSelectStrokeWidth(1);
    initSelectionButtons();
    setHighlightSelectionControls();
    this.neonView.view.addUpdateCallback(this.setSelectListeners.bind(this));
  }

  /**
   * Get the user mode that Neon is in. Either insert, edit, or viewer.
   * @returns {UserType}
   */
  getUserMode (): UserType {
    const { userMode } = getSettings();
    return userMode;
  }

  setSelectListeners (): void {
    Select.clickSelect('.active-page > svg > svg, .active-page > svg > svg use, .active-page > svg > svg rect');
    Select.dragSelect('.active-page svg');
  }
}

export { DivaEdit as default };
