import * as Cursor from '../utils/Cursor.js';
const d3 = require('d3');

/**
 * Handle inserting new musical elements and communicate this to Verovio.
 * @constructor
 * @param {NeonView} neonView - The NeonView parent.
 * @param {string} sel - A CSS selector representing where to put the listeners.
 */
function InsertHandler (neonView, sel) {
  var type = '';
  var firstClick = true;
  var coord;
  var attributes = null;
  var selector = sel;

  /**
     * Switch to insert mode based on the button pressed.
     * @param {string} buttonId - The ID of the button pressed.
     */
  function insertActive (buttonId) {
    let alreadyInInsertMode = isInsertMode();
    if (buttonId === 'punctum') {
      type = 'nc';
      attributes = null;
    } else if (buttonId === 'diamond') {
      type = 'nc';
      attributes = {
        'tilt': 'se'
      };
    } else if (buttonId === 'virga') {
      type = 'nc';
      attributes = {
        'tilt': 'n'
      };
    } else if (buttonId === 'pes') {
      let contour = neonView.info.getContourByValue('Pes');
      type = 'grouping';
      attributes = {
        'contour': contour
      };
    } else if (buttonId === 'clivis') {
      let contour = neonView.info.getContourByValue('Clivis');
      type = 'grouping';
      attributes = {
        'contour': contour
      };
    } else if (buttonId === 'scandicus') {
      let contour = neonView.info.getContourByValue('Scandicus');
      type = 'grouping';
      attributes = {
        'contour': contour
      };
    } else if (buttonId === 'climacus') {
      let contour = neonView.info.getContourByValue('Climacus');
      type = 'grouping';
      attributes = {
        'contour': contour
      };
    } else if (buttonId === 'torculus') {
      let contour = neonView.info.getContourByValue('Torculus');
      type = 'grouping';
      attributes = {
        'contour': contour
      };
    } else if (buttonId === 'porrectus') {
      let contour = neonView.info.getContourByValue('Porrectus');
      type = 'grouping';
      attributes = {
        'contour': contour
      };
    } else if (buttonId === 'pressus') {
      let contour = neonView.info.getContourByValue('Pressus');
      type = 'grouping';
      attributes = {
        'contour': contour
      };
    } else if (buttonId === 'cClef') {
      type = 'clef';
      attributes = {
        'shape': 'C'
      };
    } else if (buttonId === 'fClef') {
      type = 'clef';
      attributes = {
        'shape': 'F'
      };
    } else if (buttonId === 'custos') {
      type = 'custos';
      attributes = null;
    } else if (buttonId === 'staff') {
      type = 'staff';
      attributes = null;
    } else {
      type = '';
      attributes = null;
      console.error('Invalid button for insertion: ' + buttonId + '.');
      return;
    }
    removeInsertClickHandlers();
    if (type === 'staff') {
      document.querySelector(selector).addEventListener('click', staffHandler);
    } else {
      document.querySelector(selector).addEventListener('click', handler);
    }

    // Disable edit mode listeners
    document.body.addEventListener('keydown', keydownListener);
    document.body.addEventListener('keyup', resetInsertHandler);
    document.body.addEventListener('click', clickawayHandler);

    // Add 'return to edit mode' button
    if (!alreadyInInsertMode) {
      let editModeButton = document.createElement('button');
      editModeButton.id = 'returnToEditMode';
      editModeButton.classList.add('button');
      editModeButton.innerHTML = 'Return to Edit Mode';
      document.getElementById('redo').parentNode.appendChild(editModeButton);
      editModeButton.addEventListener('click', insertDisabled);
    }
    let editMenu = document.getElementById('editMenu');
    editMenu.style.backgroundColor = 'whitesmoke';
    editMenu.style.fontWeight = '';
    let insertMenu = document.getElementById('insertMenu');
    insertMenu.style.backgroundColor = '#ffc7c7';
    insertMenu.style.fontWeight = 'bold';
  }

  /**
     * Disable insert mode
     */
  function insertDisabled () {
    type = '';
    removeInsertClickHandlers();
    document.body.removeEventListener('keydown', keydownListener);
    document.body.removeEventListener('keyup', resetInsertHandler);
    document.body.removeEventListener('click', clickawayHandler);
    document.querySelector('.insertel.is-active').classList.remove('is-active');
    firstClick = true;
    Cursor.resetCursor();
    try {
      document.getElementById('returnToEditMode').remove();
    } catch (e) {
      console.debug(e);
    }
    let editMenu = document.getElementById('editMenu');
    let insertMenu = document.getElementById('insertMenu');
    editMenu.style.backgroundColor = '#ffc7c7';
    editMenu.style.fontWeight = 'bold';
    insertMenu.style.backgroundColor = 'whitesmoke';
    insertMenu.style.fontWeight = '';
  }

  function clickawayHandler (evt) {
    if (evt.target.closest('.active-page') === null &&
      evt.target.closest('#insert_controls') === null &&
      evt.target.closest('#svg_group') === null) {
      insertDisabled();
      document.body.removeEventListener('keydown', staffHandler);
      document.body.removeEventListener('keydown', handler);
    }
  }

  function resetInsertHandler (evt) {
    if (evt.key === 'Shift') {
      document.querySelector(selector).addEventListener('click',
        type === 'staff' ? staffHandler : handler);
    }
  }

  function keydownListener (evt) {
    if (evt.key === 'Escape') {
      insertDisabled();
      document.body.removeEventListener('keydown', staffHandler);
      document.body.removeEventListener('keydown', handler);
    } else if (evt.key === 'Shift') {
      removeInsertClickHandlers();
    }
  }

  /**
     * Event handler for insert events other than staff. Creates an insert action and sends it to Verovio.
     * @param {object} evt - JQuery event object.
     */
  function handler (evt) {
    var container = document.getElementsByClassName('active-page')[0].getElementsByClassName('definition-scale')[0];
    var pt = container.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    // Transform pt to SVG context
    var transformMatrix = container.getElementsByClassName('system')[0].getScreenCTM();
    var cursorpt = pt.matrixTransform(transformMatrix.inverse());

    let editorAction = {
      'action': 'insert',
      'param': {
        'elementType': type,
        'staffId': 'auto',
        'ulx': cursorpt.x,
        'uly': cursorpt.y
      }
    };

    if (attributes !== null) {
      editorAction['param']['attributes'] = attributes;
    }

    if (attributes !== null && attributes['shape'] === 'F' ) {
      editorAction['param']['ulx'] = editorAction['param']['ulx'] - 50;
    }

    neonView.edit(editorAction, neonView.view.getCurrentPageURI()).then(() => {
      neonView.updateForCurrentPage();
    });
  }

  /**
     * Event handler for staff insertion. Creates an insert action with two points (ul and lr) and sends it to Verovio.
     * @param {object} evt - JQuery event object.
     */
  function staffHandler (evt) {
    var container = document.getElementsByClassName('active-page')[0].getElementsByClassName('definition-scale')[0];
    var pt = container.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    var transformMatrix = container.getElementsByClassName('system')[0].getScreenCTM();
    var cursorpt = pt.matrixTransform(transformMatrix.inverse());

    if (firstClick) {
      coord = cursorpt;
      d3.select(container).append('circle').attr('cx', cursorpt.x)
        .attr('cy', cursorpt.y)
        .attr('r', 10)
        .attr('id', 'staff-circle')
        .attr('fill', 'green');
      firstClick = false;
    } else {
      var ul, lr;
      if (cursorpt.x < coord.x || cursorpt.y < coord.y) { // second point is not lr
        ul = cursorpt;
        lr = coord;
      } else {
        ul = coord;
        lr = cursorpt;
      }
      document.getElementById('staff-circle').remove();
      let action = {
        'action': 'insert',
        'param': {
          'elementType': 'staff',
          'staffId': 'auto',
          'ulx': ul.x,
          'uly': ul.y,
          'lrx': lr.x,
          'lry': lr.y
        }
      };

      neonView.edit(action, neonView.view.getCurrentPageURI()).then(() => {
        neonView.updateForCurrentPage();
        firstClick = true;
      });
    }
  }

  function removeInsertClickHandlers () {
    document.querySelector(selector).removeEventListener('click', staffHandler);
    document.querySelector(selector).removeEventListener('click', handler);
  }

  /**
     * If Neon is in insert mode.
     * @returns {boolean}
     */
  function isInsertMode () {
    return (type !== '');
  }

  InsertHandler.prototype.constructor = InsertHandler;
  InsertHandler.prototype.insertActive = insertActive;
  InsertHandler.prototype.insertDisabled = insertDisabled;
  InsertHandler.prototype.isInsertMode = isInsertMode;
}
export { InsertHandler as default };
