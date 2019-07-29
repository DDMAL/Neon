/** @module SquareEdit/Controls */

import * as Contents from './Contents.js';
import * as Cursor from '../utils/Cursor.js';
import { setGroupingHighlight } from '../utils/Color.js';
import Icons from '../img/icons.svg';
import { unselect } from '../utils/SelectTools.js';
const $ = require('jquery');

/**
 * Set listener on EditMode button.
 * @param {EditMode} editMode - The EditMode object.
 */
export function initEditModeControls (editMode) {
  document.getElementById('edit_mode').addEventListener('click', function () {
    $('#insert_controls').append(Contents.insertControlsPanel);
    $('#edit_controls').append(Contents.editControlsPanel);
    editMode.initEditMode();
  });
}

/**
 * Bind listeners to insert tabs.'
 * @param {InsertHandler} insertHandler - An InsertHandler to run the tasks.
 */
export function bindInsertTabs (insertHandler) {
  var insertTabs = $('.insertTab');
  var tabIds = $.map(insertTabs, function (tab, i) {
    return tab.id;
  });

  document.body.addEventListener('keydown', (evt) => {
    if (evt.code.match(/^Digit\d$/) && evt.shiftKey) {
      try {
        let index = Number(evt.code[evt.code.length - 1]) - 1;
        let insertOptions = document.getElementsByClassName('insertel');
        let selectedOption = insertOptions[index];
        deactivate('.insertel');
        activate(selectedOption.id, insertHandler);
        Cursor.updateCursor();
      } catch (e) {
        console.debug(e);
      }
    }
  });

  $.each(tabIds, function (i, tab) {
    $('#' + tab).on('click', () => {
      deactivate('.insertTab');
      activate(tab, insertHandler);
      Cursor.resetCursor();
      $('#insert_data').empty();
      $('#insert_data').append(Contents.insertTabHtml[tab]);
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
  $('#toggleInsert').on('click', () => {
    if ($('#insertContents').is(':hidden')) {
      $('#insertContents').css('display', '');
      $('#toggleInsert').attr('xlink:href', Icons + '#dropdown-down');
    } else {
      $('#insertContents').css('display', 'none');
      $('#toggleInsert').attr('xlink:href', Icons + '#dropdown-side');
    }
  });

  $('#toggleEdit').on('click', () => {
    if ($('#editContents').is(':hidden')) {
      $('#editContents').css('display', '');
      $('#toggleEdit').attr('xlink:href', Icons + '#dropdown-down');
    } else {
      $('#editContents').css('display', 'none');
      $('#toggleEdit').attr('xlink:href', Icons + '#dropdown-side');
    }
  });
}

/**
 * Activate a certain insert action.
 * @param {string} id - The ID of the insert action tab.
 * @param {InsertHandler} insertHandler - An InsertHandler object.
 */
function activate (id, insertHandler) {
  $('#' + id).addClass('is-active');
  if (document.getElementById(id).classList.contains('insertel')) {
    insertHandler.insertActive(id);
  }
}

/**
 * Deactivate a certain insert action.
 * @param {string} type - A JQuery selector for the action tab.
 */
function deactivate (type) {
  var elList = Array.from($(type));
  elList.forEach((el, i) => {
    $(elList[i]).removeClass('is-active');
  });
}

/**
 * Bind listeners to insert tab elements.
 * @param {InsertHandler} insertHandler - An InsertHandler object.
 */
function bindElements (insertHandler) {
  var insertElements = $('.insertel');
  var elementIds = $.map(insertElements, function (el, i) {
    return el.id;
  });
  $.each(elementIds, function (i, el) {
    $('#' + el).on('click', function () {
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
  $('#selBySyl').on('click', selectBySylHandler);
  $('body').on('keydown', (evt) => {
    if (evt.key === '1') {
      selectBySylHandler();
    }
  });

  function selectBySylHandler () {
    if (!$('#selBySyl').hasClass('is-active')) {
      unselect();
      $('#moreEdit').empty();
      $('#selBySyl').addClass('is-active');
      $('#selByBBox').removeClass('is-active');
      $('#selByNeume').removeClass('is-active');
      $('#selByNc').removeClass('is-active');
      $('#selByStaff').removeClass('is-active');
      if ($('.highlight-selected').attr('id') === 'highlight-selection') {
        setGroupingHighlight('syllable');
      }
    }
  }

  $('#selByNeume').on('click', selectByNeumeHandler);
  $('body').on('keydown', (evt) => {
    if (evt.key === '2') {
      selectByNeumeHandler();
    }
  });

  function selectByNeumeHandler () {
    if (!$('#selByNeume').hasClass('is-active')) {
      unselect();
      $('#moreEdit').empty();
      $('#selByNeume').addClass('is-active');
      $('#selByBBox').removeClass('is-active');
      $('#selByNc').removeClass('is-active');
      $('#selByStaff').removeClass('is-active');
      $('#selBySyl').removeClass('is-active');
      if ($('.highlight-selected').attr('id') === 'highlight-selection') {
        setGroupingHighlight('neume');
      }
    }
  }

  $('#selByNc').on('click', selectByNcHandler);
  $('body').on('keydown', (evt) => {
    if (evt.key === '3') {
      selectByNcHandler();
    }
  });

  function selectByNcHandler () {
    if (!$('#selByNc').hasClass('is-active')) {
      unselect();
      $('#moreEdit').empty();
      $('#selByNc').addClass('is-active');
      $('#selByBBox').removeClass('is-active');
      $('#selByNeume').removeClass('is-active');
      $('#selByStaff').removeClass('is-active');
      $('#selBySyl').removeClass('is-active');
      if ($('.highlight-selected').attr('id') === 'highlight-selection') {
        setGroupingHighlight('neume');
      }
    }
  }

  $('#selByStaff').on('click', selectByStaffHandler);
  $('body').on('keydown', (evt) => {
    if (evt.key === '4') {
      selectByStaffHandler();
    }
  });

  function selectByStaffHandler () {
    if (!$('#selByStaff').hasClass('is-active')) {
      unselect();
      $('#moreEdit').empty();
      $('#selByStaff').addClass('is-active');
      $('#selByBBox').removeClass('is-active');
      $('#selByNc').removeClass('is-active');
      $('#selByNeume').removeClass('is-active');
      $('#selBySyl').removeClass('is-active');
      if ($('.highlight-selected').attr('id') === 'highlight-selection') {
        setGroupingHighlight('staff');
      }
    }
  }
}
