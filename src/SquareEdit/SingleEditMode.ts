import { bindInsertTabs, initInsertEditControls, initSelectionButtons } from './Controls';
import { setHighlightOption } from '../DisplayPanel/DisplayControls';
import { initUndoRedoPanel } from '../utils/EditControls';
import * as Select from '../utils/Select';
import InsertHandler from './InsertHandler';
import NeonView from '../NeonView';
import * as SelectOptions from './SelectOptions';
import DragHandler from '../utils/DragHandler';
import { NeumeEditInterface } from '../Interfaces';
import * as Contents from './Contents';
import { undoRedoPanel } from '../utils/EditContents';
import { initNavbar } from '../utils/EditControls';
import { getSettings } from '../utils/LocalSettings';
import { UserType } from '../Types';

/**
 * An Edit Module for a single page of a manuscript.
 * Works with the SingleView module.
 */
class SingleEditMode implements NeumeEditInterface {
  neonView: NeonView;
  dragHandler: DragHandler;
  insertHandler: InsertHandler;
  /**
   * Constructor for an EditMode object.
   * @param {NeonView} neonView - The NeonView parent.
   */
  constructor (neonView: NeonView) {
    this.neonView = neonView;
    this.initEditMode();
  }

  /**
   * Initialize Edit mode (default).
   */
  initEditMode (): void {

    initNavbar(this.neonView);
    document.getElementById('insert_controls').innerHTML += Contents.insertControlsPanel;
    document.getElementById('edit_controls').innerHTML += Contents.editControlsPanel;
    document.getElementById('undoRedo_controls').innerHTML = undoRedoPanel;

    this.dragHandler = new DragHandler(this.neonView, '#svg_group');
    this.insertHandler = new InsertHandler(this.neonView, '#svg_group');
    bindInsertTabs(this.insertHandler);
    const { insertTab } = getSettings();
    document.getElementById(insertTab).click();
    Select.setSelectHelperObjects(this.neonView, this.dragHandler);
    this.setSelectListeners();

    SelectOptions.initNeonView(this.neonView);
    initInsertEditControls();
    initSelectionButtons();
    initUndoRedoPanel(this.neonView);
    setHighlightOption('selection');
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
    Select.clickSelect('#svg_group, #svg_group use, #svg_group rect');
    Select.dragSelect('#svg_group');
  }
}

export { SingleEditMode as default };
