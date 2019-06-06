/** @module UnifiedEdit/EditControls */

import * as Contents from './EditContents.js';
import * as Cursor from './Cursor.js';
import Icons from '../img/icons.svg';
import * as Notification from './Notification.js';
import { unselect } from './SelectTools.js';
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
        .attr('download', neonView.view.getPageName() + '.mei');
    });
  });
}

/**
 * initialize undo/redo panel
 * @param {NeonView} neonView - the NeonView parent
 */
export function initUndoRedoPanel (neonView) {
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

  function undoHandler () {
    if (!neonView.undo(neonView.view.getCurrentPage())) {
      console.error('Failed to undo action.');
    } else {
      neonView.updateForCurrentPage();
    }
  }

  function redoHandler () {
    if (!neonView.redo(neonView.view.getCurrentPage())) {
      console.error('Failed to redo action');
    } else {
      neonView.updateForCurrentPage();
    }
  }
}
