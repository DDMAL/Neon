/** @module utils/EditControls */

import * as Notification from './Notification.js';
import { navbarDropdownMenu, undoRedoPanel } from './EditContents';

const $ = require('jquery');

/**
 * prepare the edit mode button
 * @param {NeonView} neonView
 */
export function prepareEditMode (neonView) {
  let parent = document.getElementById('dropdown_toggle');
  let editItem = document.createElement('a');
  editItem.classList.add('navbar-item');
  let editButton = document.createElement('button');
  editButton.classList.add('button');
  editButton.id = 'edit_mode';
  editButton.textContent = 'Edit MEI';
  editItem.appendChild(editButton);
  parent.appendChild(editItem);

  editButton.addEventListener('click', () => {
    startEditMode(neonView);
  });
}

/**
 * start the basic edit mode features
 * is called when the edit mode button is clicked
 * @param {NeonView} neonView
 */
export function startEditMode (neonView) {
  $('#dropdown_toggle').empty();
  $('#dropdown_toggle').append(navbarDropdownMenu);
  $('#undoRedo_controls').append(undoRedoPanel);
  initNavbar(neonView);
  initUndoRedoPanel(neonView);

  let selectionHighlight = document.createElement("a");
  let divider = document.createElement('hr');
  divider.classList.add('dropdown-divider');
  selectionHighlight.classList.add('dropdown-item');
  selectionHighlight.id = 'highlight-selection';
  selectionHighlight.textContent = 'By Selection Mode';
  (document.getElementsByClassName('dropdown-content'))[0].appendChild(divider);
  (document.getElementsByClassName('dropdown-content'))[0].appendChild(selectionHighlight);
}

/**
 * Set listener on switching EditMode button to File dropdown in the navbar.
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

  $('#export').on('click', (evt) => {
    neonView.export().then(manifest => {
      let link = document.createElement('a');
      link.href = manifest;
      link.download = neonView.name + '.jsonld';
      $('body').append(link);
      link.click();
      link.remove();
      Notification.queueNotification('Saved');
    });
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
    let uri = neonView.view.getCurrentPageURI();
    neonView.getPageMEI(uri).then(mei => {
      let data = 'data:application/mei+xml;base64,' + window.btoa(mei);
      $('#getmei').attr('href', data)
        .attr('download', neonView.view.getPageName() + '.mei');
    });
  });
}

/**
 * Initialize the undo/redo panel
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

  /**
   * Tries to undo an action and update the page if it succeeds.
   */
  function undoHandler () {
    neonView.undo(neonView.view.getCurrentPageURI()).then(result => {
      if (result) {
        neonView.updateForCurrentPage();
      } else {
        console.error('Failed to undo action');
      }
    });
  }

  /**
   * Tries to redo an action and update the page if it succeeds.
   */
  function redoHandler () {
    neonView.redo(neonView.view.getCurrentPageURI()).then(result => {
      if (result) {
        neonView.updateForCurrentPage();
      } else {
        console.error('Failed to redo action');
      }
    });
  }
}
