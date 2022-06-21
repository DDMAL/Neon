/** @module SquareEdit/Controls */

import * as Contents from './Contents';
import { setGroupingHighlight } from '../utils/Color';
import { unselect } from '../utils/SelectTools';
import InsertHandler from './InsertHandler';


/**
 * Bind listeners to insert tabs.'
 */
export function bindInsertTabs (insertHandler: InsertHandler): void {
  const insertTabs: Element[] = Array.from(document.getElementsByClassName('insertTab'));
  const tabIds: string[] = insertTabs.map((tab) => { return tab.id; });

  document.body.addEventListener('keydown', (evt: KeyboardEvent) => {
    console.log('here');
    if (evt.code.match(/^Digit\d$/) && evt.shiftKey) {
      try {
        const index = Number(evt.code[evt.code.length - 1]) - 1;
        const insertOptions = document.getElementsByClassName('insertel');
        const selectedOption = insertOptions[index];
        (<HTMLButtonElement> selectedOption).click();
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

  const insertPanel = document.getElementById('insert_controls');
  const insertHeading = document.getElementById('insertMenu');
  const insertHeadingTitle = insertHeading.querySelector('.panel-heading-title');
  const insertContents = document.getElementById('insertContents');
  const insertDropdownIcon = insertHeading.querySelector('svg > use');

  const editPanel = document.getElementById('edit_controls');
  const editHeading = document.getElementById('editMenu');
  const displayHeadingTitle = editHeading.querySelector('.panel-heading-title');
  const editContents = document.getElementById('editContents');
  const editDropdownIcon = editHeading.querySelector('svg > use');


  // event listener for when user clicks inside Insert panel
  // insert mode is activated
  insertPanel.addEventListener('click', () => {
    displayHeadingTitle.classList.remove('focused');
    insertHeadingTitle.classList.add('focused');

    (<HTMLButtonElement> document.querySelector('.insertel.is-active')).click();
    editPanel.querySelector('.side-panel-btn.sel-by.is-active').classList.add('unfocused');
    insertPanel.querySelector('.side-panel-btn.insertel.is-active').classList.remove('unfocused');
  });

  // event listener for when user clicks inside Edit panel
  // edit mode is activated
  editPanel.addEventListener('click', () => {
    insertHeadingTitle.classList.remove('focused');
    displayHeadingTitle.classList.add('focused');

    insertPanel.querySelector('.side-panel-btn.insertel.is-active').classList.add('unfocused');
    editPanel.querySelector('.side-panel-btn.sel-by.is-active').classList.remove('unfocused');
  });


  insertHeading.addEventListener('click', () => {
    // if insert panel is closed, open it
    if (insertContents.classList.contains('closed')) {
      // set classes and styles for an open panel
      insertContents.classList.remove('closed');
      insertContents.style.padding = '0.5em 0.75em';
      setTimeout(() => {
        insertContents.style.overflow = 'visible';
      }, 200);
      insertDropdownIcon.setAttribute('xlink:href', `${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down`);
    } 
    // if insert panel is open, close it
    else {
      // set classes and styles for a closed panel
      insertContents.classList.add('closed');
      insertContents.style.overflow = 'hidden';
      setTimeout(() => {
        insertContents.style.padding = '0px';
      }, 200);
      insertDropdownIcon.setAttribute('xlink:href', `${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-side`);
    }
  });

  editHeading.addEventListener('click', () => {
    // if edit panel is open, close it
    if (editContents.classList.contains('closed')) {
      // set classes and styles for an open panel
      editContents.classList.remove('closed');
      editContents.style.padding = '0.5em 0.75em';
      setTimeout(() => {
        editContents.style.overflow = 'visible';
      }, 200);
      editDropdownIcon.setAttribute('xlink:href', `${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down`);
    }
    // if edit panel is closed, open it
    else {
      // set classes and styles for a closed panel
      editContents.classList.add('closed');
      editContents.style.overflow = 'hidden';
      setTimeout(() => {
        editContents.style.padding = '0px';
      }, 200);
      editDropdownIcon.setAttribute('xlink:href', `${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-side`);
    }
  });
}

/**
 * Activate a certain insert action.
 * This function is used for activating insert PANELS
 * and insert ICONS (whyyy).
 * @param id - The ID of the insert action tab.
 */
function activate (id: string, insertHandler: InsertHandler): void {
  const selectedTab = document.getElementById(id);
  selectedTab.classList.add('is-active');
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
    el.classList.remove('unfocused');
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
  const selBySyllable = document.getElementById('selBySyllable');
  const selByNeume = document.getElementById('selByNeume');
  const selByNc = document.getElementById('selByNc');
  const selByStaff = document.getElementById('selByStaff');
  const selByLayerElement = document.getElementById('selByLayerElement');

  selBySyllable.addEventListener('click', selectBySylHandler);
  selByNeume.addEventListener('click', selectByNeumeHandler);
  selByNc.addEventListener('click', selectByNcHandler);
  selByStaff.addEventListener('click', selectByStaffHandler);
  selByLayerElement.addEventListener('click', selByLayerElementHandler);

  document.body.addEventListener('keydown', (evt) => {
    if (evt.key === '1') selBySyllable.click();
    if (evt.key === '2') selByNeume.click();
    if (evt.key === '3') selByNc.click();
    if (evt.key === '4') selByStaff.click();
    if (evt.key === '5') selByLayerElement.click();
  });


  function selectBySylHandler () {
    if (!selBySyllable.classList.contains('is-active')) {
      unselect();
      document.getElementById('moreEdit').innerHTML = '';
      document.getElementById('extraEdit').innerHTML = '';
      document.getElementById('moreEdit').parentElement.classList.add('hidden');
      document.getElementById('extraEdit').parentElement.classList.add('hidden');
      selBySyllable.classList.add('is-active');

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
      document.getElementById('moreEdit').parentElement.classList.add('hidden');
      document.getElementById('extraEdit').parentElement.classList.add('hidden');
      selByNeume.classList.add('is-active');
      selByNc.classList.remove('is-active');
      selBySyllable.classList.remove('is-active');
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
      document.getElementById('moreEdit').parentElement.classList.add('hidden');
      document.getElementById('extraEdit').parentElement.classList.add('hidden');
      selByNc.classList.add('is-active');
      selByNeume.classList.remove('is-active');
      selBySyllable.classList.remove('is-active');
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
      document.getElementById('moreEdit').parentElement.classList.add('hidden');
      document.getElementById('extraEdit').parentElement.classList.add('hidden');
      selByStaff.classList.add('is-active');
      selByNeume.classList.remove('is-active');
      selByNc.classList.remove('is-active');
      selBySyllable.classList.remove('is-active');
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
      document.getElementById('moreEdit').parentElement.classList.add('hidden');
      document.getElementById('extraEdit').parentElement.classList.add('hidden');
      selByLayerElement.classList.add('is-active');
      selByNeume.classList.remove('is-active');
      selByNc.classList.remove('is-active');
      selByStaff.classList.remove('is-active');
      selBySyllable.classList.remove('is-active');
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
