/** @module SquareEdit/Controls */

import * as Contents from './Contents.js';
import * as Cursor from '../utils/Cursor.js';
import { setGroupingHighlight } from '../utils/Color.js';
import Icons from '../img/icons.svg';
import { unselect } from '../utils/SelectTools.js';

/**
 * Set listener on EditMode button.
 * @param {EditMode} editMode - The EditMode object.
 */
export function initEditModeControls (editMode) {
  document.getElementById('edit_mode').addEventListener('click', function () {
    document.getElementById('insert_controls').innerHTML += Contents.insertControlsPanel;
    document.getElementById('edit_controls').innerHTML += Contents.editControlsPanel;
    editMode.initEditMode();
  });
}

/**
 * Bind listeners to insert tabs.'
 * @param {InsertHandler} insertHandler - An InsertHandler to run the tasks.
 */
export function bindInsertTabs (insertHandler) {
  var insertTabs = Array.from(document.getElementsByClassName('insertTab'));
  var tabIds = insertTabs.map((tab, i) => { return tab.id; });

  document.body.addEventListener('keydown', (evt) => {
    if (evt.code.match(/^Digit\d$/) && evt.shiftKey) {
      try {
        let index = Number(evt.code[evt.code.length - 1]) - 1;
        let insertOptions = document.getElementsByClassName('insertel');
        let selectedOption = insertOptions[index];
        deactivate('.insertel');
        insertHandler.insertDisabled();
        activate(selectedOption.id, insertHandler);
        Cursor.updateCursor();
      } catch (e) {
        console.debug(e);
      }
    }
  });

  tabIds.forEach((tab) => {
    document.getElementById(tab).addEventListener('click', () => {
      deactivate('.insertTab');
      activate(tab, insertHandler);
      Cursor.resetCursor();
      document.getElementById('insert_data').innerHTML = Contents.insertTabHtml[tab];
      bindElements(insertHandler);
      deactivate('.insertel');
      let firstOption = document.getElementsByClassName('insertel')[0];
      activate(firstOption.id, insertHandler);
      Cursor.updateCursor();
    });
  });
}

/**
 * Initialize Edit and Insert control panels.
 * @param {NeonView} neonView - The NeonView parent.
 */
export function initInsertEditControls (neonView) {
  let toggleInsert = document.getElementById('toggleInsert');
  let toggleEdit = document.getElementById('toggleEdit');
  let insertContents = document.getElementById('insertContents');
  let editContents = document.getElementById('editContents');
  toggleInsert.addEventListener('click', () => {
    if (insertContents.style.display === 'none') {
      insertContents.style.display = '';
      toggleInsert.setAttribute('xlink:href', Icons + '#dropdown-down');
    } else {
      insertContents.style.display = 'none';
      toggleInsert.setAttribute('xlink:href', Icons + '#dropdown-side');
    }
  });

  toggleEdit.addEventListener('click', () => {
    if (editContents.style.display === 'none') {
      editContents.style.display = '';
      toggleEdit.setAttribute('xlink:href', Icons + '#dropdown-down');
    } else {
      editContents.style.display = 'none';
      toggleEdit.setAttribute('xlink:href', Icons + '#dropdown-side');
    }
  });
}

/**
 * Activate a certain insert action.
 * @param {string} id - The ID of the insert action tab.
 * @param {InsertHandler} insertHandler - An InsertHandler object.
 */
function activate (id, insertHandler) {
  document.getElementById(id).classList.add('is-active');
  if (document.getElementById(id).classList.contains('insertel')) {
    insertHandler.insertActive(id);
  }
}

/**
 * Deactivate a certain insert action.
 * @param {string} type - A CSS selector for the action tab.
 */
function deactivate (type) {
  var elList = document.querySelectorAll(type);
  elList.forEach(el => {
    el.classList.remove('is-active');
  });
}

/**
 * Bind listeners to insert tab elements.
 * @param {InsertHandler} insertHandler - An InsertHandler object.
 */
function bindElements (insertHandler) {
  var insertElements = Array.from(document.getElementsByClassName('insertel'));
  var elementIds = insertElements.map(el => el.id);
  elementIds.forEach(el => {
    document.getElementById(el).addEventListener('click', () => {
      deactivate('.insertel');
      activate(el, insertHandler);
      Cursor.updateCursor();
    });
  });
}

/**
 * Set listeners on the buttons to change selection modes.
 */
export function initSelectionButtons () {
  let selBySyl = document.getElementById('selBySyl');
  let selByNeume = document.getElementById('selByNeume');
  let selByNc = document.getElementById('selByNc');
  let selByStaff = document.getElementById('selByStaff');

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

  function selectBySylHandler () {
    if (!selBySyl.classList.contains('is-active')) {
      unselect();
      document.getElementById('moreEdit').innerHTML = '';
      selBySyl.classList.add('is-active');
      selByNeume.classList.remove('is-active');
      selByNc.classList.remove('is-active');
      selByStaff.classList.remove('is-active');
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
      selByNeume.classList.add('is-active');
      selByNc.classList.remove('is-active');
      selBySyl.classList.remove('is-active');
      selByStaff.classList.remove('is-active');
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
      selByNc.classList.add('is-active');
      selByNeume.classList.remove('is-active');
      selBySyl.classList.remove('is-active');
      selByStaff.classList.remove('is-active');
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
      selByStaff.classList.add('is-active');
      selByNeume.classList.remove('is-active');
      selByNc.classList.remove('is-active');
      selBySyl.classList.remove('is-active');
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
}
