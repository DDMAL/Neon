/** @module SquareEdit/Controls */

import * as Contents from './Contents';
import { setGroupingHighlight } from '../utils/Color';
import { unselect } from '../utils/SelectTools';
import InsertHandler from './InsertHandler';
import { NeumeEditInterface } from '../Interfaces';
import { undoRedoPanel } from '../utils/EditContents';

/**
 * Set listener on EditMode button.
 */
export function initEditModeControls (editMode: NeumeEditInterface): void {
  document.getElementById('edit_mode').addEventListener('click', function () {
    document.getElementById('insert_controls').innerHTML += Contents.insertControlsPanel;
    document.getElementById('edit_controls').innerHTML += Contents.editControlsPanel;
    document.getElementById('undoRedo_controls').innerHTML = undoRedoPanel;
    editMode.initEditMode();
  });
}

/**
 * Bind listeners to insert tabs.'
 */
export function bindInsertTabs (insertHandler: InsertHandler): void {
  const insertTabs: Element[] = Array.from(document.getElementsByClassName('insertTab'));
  const tabIds: string[] = insertTabs.map((tab) => { return tab.id; });

  document.body.addEventListener('keydown', (evt: KeyboardEvent) => {
    if (evt.code.match(/^Digit\d$/) && evt.shiftKey) {
      try {
        const index = Number(evt.code[evt.code.length - 1]) - 1;
        const insertOptions = document.getElementsByClassName('insertel');
        const selectedOption = insertOptions[index];
        deactivate('.insertel');
        insertHandler.insertDisabled();
        activate(selectedOption.id, insertHandler);
      } catch (e) {
        console.debug(e);
      }
    }
  });

  tabIds.forEach((tab) => {
    document.getElementById(tab).addEventListener('click', () => {
      deactivate('.insertTab');
      activate(tab, insertHandler);
      document.getElementById('insert_data').innerHTML = Contents.insertTabHtml[tab];
      bindElements(insertHandler);
      deactivate('.insertel');
      const firstOption = document.getElementsByClassName('insertel')[0];
      activate(firstOption.id, insertHandler);
    });
  });
}

/**
 * Initialize Edit and Insert control panels.
 */
export function initInsertEditControls (): void {
  const insertHeading = document.getElementById('insertMenu');
  const insertContents = document.getElementById('insertContents');
  const insertDropdownIcon = insertHeading.querySelector('svg > use');

  const editHeading = document.getElementById('editMenu');
  const editContents = document.getElementById('editContents');
  const editDropdownIcon = editHeading.querySelector('svg > use');

  insertHeading.addEventListener('click', () => {
    if (insertContents.classList.contains('closed')) {
      insertContents.classList.remove('closed');
      insertContents.style.padding = '0.5em 0.75em';
      insertContents.style.overflow = 'hidden';
      setTimeout(() => {
        insertContents.style.overflow = 'visible';
      }, 200);
      insertDropdownIcon.setAttribute('xlink:href', __ASSET_PREFIX__ + 'assets/img/icons.svg' + '#dropdown-down');
    } else {
      insertContents.classList.add('closed');
      setTimeout(() => {
        insertContents.style.padding = '0px';
      }, 200);
      insertDropdownIcon.setAttribute('xlink:href', __ASSET_PREFIX__ + 'assets/img/icons.svg' + '#dropdown-side');
    }
  });

  editHeading.addEventListener('click', () => {
    if (editContents.classList.contains('closed')) {
      editContents.classList.remove('closed');
      editContents.style.padding = '0.5em 0.75em';
      editContents.style.overflow = 'hidden';
      setTimeout(() => {
        editContents.style.overflow = 'visible';
      }, 200);
      editDropdownIcon.setAttribute('xlink:href', __ASSET_PREFIX__ + 'assets/img/icons.svg' + '#dropdown-down');
    } else {
      editContents.classList.add('closed');
      setTimeout(() => {
        editContents.style.padding = '0px';
      }, 200);
      editDropdownIcon.setAttribute('xlink:href', __ASSET_PREFIX__ + 'assets/img/icons.svg' + '#dropdown-side');
    }
  });
}

/**
 * Activate a certain insert action.
 * @param id - The ID of the insert action tab.
 */
function activate (id: string, insertHandler: InsertHandler) {
  document.getElementById(id).classList.add('is-active');
  if (document.getElementById(id).classList.contains('insertel')) {
    insertHandler.insertActive(id);
  }
}

/**
 * Deactivate a certain insert action.
 * @param type - A CSS selector for the action tab.
 */
function deactivate (type: string) {
  const elList = document.querySelectorAll(type);
  elList.forEach(el => {
    el.classList.remove('is-active');
  });
}

/**
 * Bind listeners to insert tab elements.
 */
function bindElements (insertHandler: InsertHandler) {
  const insertElements = Array.from(document.getElementsByClassName('insertel'));
  const elementIds = insertElements.map(el => el.id);
  elementIds.forEach(el => {
    document.getElementById(el).addEventListener('click', () => {
      deactivate('.insertel');
      activate(el, insertHandler);
    });
  });
}

/**
 * Set listeners on the buttons to change selection modes.
 */
export function initSelectionButtons (): void {
  const selBySyl = document.getElementById('selBySyl');
  const selByNeume = document.getElementById('selByNeume');
  const selByNc = document.getElementById('selByNc');
  const selByStaff = document.getElementById('selByStaff');
  const selByLayerElement = document.getElementById('selByLayerElement');

  selBySyl.addEventListener('click', selectBySylHandler);
  document.body.addEventListener('keydown', (evt) => {
    if (evt.key === '1') {
      selectBySylHandler();
    }
  });

  selByNeume.addEventListener('click', selectByNeumeHandler);
  document.body.addEventListener('keydown', (evt) => {
    if (evt.key === '2') {
      selectByNeumeHandler();
    }
  });

  selByNc.addEventListener('click', selectByNcHandler);
  document.body.addEventListener('keydown', (evt) => {
    if (evt.key === '3') {
      selectByNcHandler();
    }
  });

  selByStaff.addEventListener('click', selectByStaffHandler);
  document.body.addEventListener('keydown', (evt) => {
    if (evt.key === '4') {
      selectByStaffHandler();
    }
  });

  selByLayerElement.addEventListener('click', selByLayerElementHandler);
  document.body.addEventListener('keydown', (evt) => {
    if (evt.key === '5') {
      selByLayerElementHandler();
    }
  });

  function selectBySylHandler () {
    if (!selBySyl.classList.contains('is-active')) {
      unselect();
      document.getElementById('moreEdit').innerHTML = '';
      document.getElementById('extraEdit').innerHTML = '';
      document.getElementById('extraEdit').classList.add('is-hidden');
      document.getElementById('moreEdit').parentElement.classList.add('hidden');
      document.getElementById('extraEdit').parentElement.classList.add('hidden');
      selBySyl.classList.add('is-active');
      selByNeume.classList.remove('is-active');
      selByNc.classList.remove('is-active');
      selByStaff.classList.remove('is-active');
      selByLayerElement.classList.remove('is-active');
      try {
        document.getElementById('selByBBox').classList.remove('is-active');
      } catch (e) {}
      try {
        if (document.querySelector('.highlight-selected').id === 'highlight-selection') {
          setGroupingHighlight('syllable');
        }
      } catch (e) {}
    }
  }

  function selectByNeumeHandler () {
    if (!selByNeume.classList.contains('is-active')) {
      unselect();
      document.getElementById('moreEdit').innerHTML = '';
      document.getElementById('extraEdit').innerHTML = '';
      document.getElementById('extraEdit').classList.add('is-hidden');
      selByNeume.classList.add('is-active');
      selByNc.classList.remove('is-active');
      selBySyl.classList.remove('is-active');
      selByStaff.classList.remove('is-active');
      selByLayerElement.classList.remove('is-active');
      try {
        document.getElementById('selByBBox').classList.remove('is-active');
      } catch (e) {}
      try {
        if (document.querySelector('.highlight-selected').id === 'highlight-selection') {
          setGroupingHighlight('neume');
        }
      } catch (e) {}
    }
  }

  function selectByNcHandler () {
    if (!selByNc.classList.contains('is-active')) {
      unselect();
      document.getElementById('moreEdit').innerHTML = '';
      document.getElementById('extraEdit').innerHTML = '';
      document.getElementById('extraEdit').classList.add('is-hidden');
      selByNc.classList.add('is-active');
      selByNeume.classList.remove('is-active');
      selBySyl.classList.remove('is-active');
      selByStaff.classList.remove('is-active');
      selByLayerElement.classList.remove('is-active');
      try {
        document.getElementById('selByBBox').classList.remove('is-active');
      } catch (e) {}
      try {
        if (document.querySelector('.highlight-selected').id === 'highlight-selection') {
          setGroupingHighlight('neume');
        }
      } catch (e) {}
    }
  }

  function selectByStaffHandler () {
    if (!selByStaff.classList.contains('is-active')) {
      unselect();
      document.getElementById('moreEdit').innerHTML = '';
      document.getElementById('extraEdit').innerHTML = '';
      document.getElementById('extraEdit').classList.add('is-hidden');
      selByStaff.classList.add('is-active');
      selByNeume.classList.remove('is-active');
      selByNc.classList.remove('is-active');
      selBySyl.classList.remove('is-active');
      selByLayerElement.classList.remove('is-active');
      try {
        document.getElementById('selByBBox').classList.remove('is-active');
      } catch (e) {}
      try {
        if (document.querySelector('.highlight-selected').id === 'highlight-selection') {
          setGroupingHighlight('staff');
        }
      } catch (e) {}
    }
  }

  function selByLayerElementHandler () {
    if (!selByLayerElement.classList.contains('is-active')) {
      unselect();
      document.getElementById('moreEdit').innerHTML = '';
      document.getElementById('extraEdit').innerHTML = '';
      document.getElementById('extraEdit').classList.add('is-hidden');
      selByLayerElement.classList.add('is-active');
      selByNeume.classList.remove('is-active');
      selByNc.classList.remove('is-active');
      selByStaff.classList.remove('is-active');
      selBySyl.classList.remove('is-active');
      try {
        document.getElementById('selByBBox').classList.remove('is-active');
      } catch (e) {}
      try {
        if (document.querySelector('.highlight-selected').id === 'highlight-selection') {
          setGroupingHighlight('layer');
        }
      } catch (e) {}
    }
  }
}
