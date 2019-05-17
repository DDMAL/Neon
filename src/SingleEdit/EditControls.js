/** @module SingleEdit/EditControls */

import * as Contents from './Contents.js';
import * as Cursor from '../utils/Cursor.js';
import Icons from '../img/icons.svg';
import * as Notification from '../utils/Notification.js';
import { unselect } from './Select.js';
const $ = require('jquery');

/**
 * Set listener on EditMode button.
 * @param {SingleEditMode} editMode - The EditMode object.
 */
export function initEditModeControls (editMode) {
  /* document.getElementById('dropdown_toggle').innerHTML =
    '<a class="navbar-item"><button class="button" id="edit_mode">' +
    'Edit MEI</button></a>'; */
  $('#edit_mode').on('click', function () {
    $('#dropdown_toggle').empty();
    $('#dropdown_toggle').append(Contents.navbarDropdownMenu);
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

  $.each(tabIds, function (i, tab) {
    $('#' + tab).on('click', () => {
      deactivate('.insertTab');
      activate(tab, insertHandler);
      Cursor.resetCursor();
      $('#insert_data').empty();
      $('#insert_data').append(Contents.insertTabHtml[tab]);
      bindElements(insertHandler);
    });
  });
}

/**
 * Set listener on switching EditMode button to File dropdown in the navbar.
 * @param {string} filename - The name of the MEI file.
 * @param {NeonView} neonView
 */
export function initNavbar (neonView) {
  // setup navbar listeners
  $('#save').on('click', () => {
    neonView.save().then(() => {
      Notification.queueNotification('Saved');
    });
  });
  $('body').on('keydown', (evt) => {
    if (evt.key === 's') {
      neonView.save().then(() => {
        Notification.queueNotification('Saved');
      });
    }
  });

  $('#revert').on('click', function () {
    if (window.confirm('Reverting will cause all changes to be lost. Press OK to continue.')) {
      neonView.deleteDb().then(() => {
        window.location.reload();
      });
    }
  });
  // Download link for MEI
  // Is an actual file with a valid URI except in local mode where it must be generated.
  $('#getmei').on('click', () => {
    neonView.getPageURI().then((uri) => {
      $('#getmei').attr('href', uri)
        .attr('download', neonView.name);
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

  $('#undo').on('click', undoHandler);
  $('body').on('keydown', (evt) => {
    if (evt.key === 'z' && (evt.ctrlKey || evt.metaKey)) {
      undoHandler();
    }
  });

  $('#redo').on('click', redoHandler);
  $('body').on('keydown', (evt) => {
    if ((evt.key === 'Z' || (evt.key === 'z' && evt.shiftKey)) && (evt.ctrlKey || evt.metaKey)) {
      redoHandler();
    }
  });

  $('#delete').on('click', removeHandler);
  $('body').on('keydown', (evt) => {
    if (evt.key === 'd' || evt.key === 'Backspace') { removeHandler(); }
  });

  function undoHandler () {
    if (!neonView.undo(0)) {
      console.error('Failed to undo action.');
    } else {
      neonView.updateForCurrentPage();
    }
  }

  function redoHandler () {
    if (!neonView.redo(0)) {
      console.error('Failed to redo action');
    } else {
      neonView.updateForCurrentPage();
    }
  }

  function removeHandler () {
    let toRemove = [];
    var selected = Array.from(document.getElementsByClassName('selected'));
    selected.forEach(elem => {
      toRemove.push(
        {
          'action': 'remove',
          'param': {
            'elementId': elem.id
          }
        }
      );
    });
    let chainAction = {
      'action': 'chain',
      'param': toRemove
    };
    neonView.edit(chainAction, 0).then(() => { neonView.updateForCurrentPage(); });
  }
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
    document.body.addEventListener('keydown', (evt) => {
      if (evt.code === 'Digit' + (i + 1) && evt.shiftKey) {
        deactivate('.insertel');
        activate(el, insertHandler);
        Cursor.updateCursor();
      }
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
      $('#selByNeume').removeClass('is-active');
      $('#selByNc').removeClass('is-active');
      $('#selByStaff').removeClass('is-active');
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
      $('#selByNc').removeClass('is-active');
      $('#selByStaff').removeClass('is-active');
      $('#selBySyl').removeClass('is-active');
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
      $('#selByNeume').removeClass('is-active');
      $('#selByStaff').removeClass('is-active');
      $('#selBySyl').removeClass('is-active');
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
      $('#selByNc').removeClass('is-active');
      $('#selByNeume').removeClass('is-active');
      $('#selBySyl').removeClass('is-active');
    }
  }
}
