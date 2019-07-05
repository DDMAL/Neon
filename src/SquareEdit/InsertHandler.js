import * as Cursor from '../utils/Cursor.js';
const d3 = require('d3');
const $ = require('jquery');

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
      $('body').on('click', selector, staffHandler);
    } else { $('body').on('click', selector, handler); }

    // Disable edit mode listeners
    $('body').on('keydown', keydownListener);

    $('body').on('keyup', resetInsertHandler);

    $('body').on('click', clickawayHandler);

    // Add 'return to edit mode' button
    if (!alreadyInInsertMode) {
      let editModeButton = document.createElement('button');
      editModeButton.id = 'returnToEditMode';
      editModeButton.classList.add('button');
      editModeButton.innerHTML = 'Return to Edit Mode';
      document.getElementById('redo').parentNode.appendChild(editModeButton);
      editModeButton.addEventListener('click', insertDisabled);
    }
    $('#editMenu').css('backgroundColor', 'whitesmoke');
    $('#editMenu').css('font-weight', '');
    $('#insertMenu').css('backgroundColor', '#ffc7c7');
    $('#insertMenu').css('font-weight', 'bold');
  }

  /**
     * Disable insert mode
     */
  function insertDisabled () {
    type = '';
    removeInsertClickHandlers();
    $('body').off('keydown', keydownListener);
    $('body').off('keyup', resetInsertHandler);
    $('body').off('click', clickawayHandler);
    $('.insertel.is-active').removeClass('is-active');
    firstClick = true;
    Cursor.resetCursor();
    try {
      $(document.getElementById('returnToEditMode')).remove();
    } catch (e) {
      console.debug(e);
    }
    $('#insertMenu').css('backgroundColor', 'whitesmoke');
    $('#insertMenu').css('font-weight', '');
    $('#editMenu').css('backgroundColor', '#ffc7c7');
    $('#editMenu').css('font-weight', 'bold');
  }

  function clickawayHandler (evt) {
    if ($(evt.target).closest('.active-page').length === 0 &&
      $(evt.target).closest('#insert_controls').length === 0 &&
      $(evt.target).closest('#svg_group').length === 0) {
      insertDisabled();
      $('body').off('keydown', staffHandler);
      $('body').off('keydown', handler);
    }
  }

  function resetInsertHandler (evt) {
    if (evt.key === 'Shift') {
      $('body').on('click', selector, type === 'staff' ? staffHandler : handler);
    }
  }

  function keydownListener (evt) {
    if (evt.key === 'Escape') {
      insertDisabled();
      $('body').off('keydown', staffHandler);
      $('body').off('keydown', handler);
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
      $('#staff-circle').remove();
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
        insertDisabled();
      });
    }
  }

  function removeInsertClickHandlers () {
    $('body').off('click', selector, staffHandler);
    $('body').off('click', selector, handler);
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
