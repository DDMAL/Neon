/** @module utils/Select */

import {
  unselect, getStaffBBox, selectStaff, selectAll, getSelectionType
} from './SelectTools.js';
import { Resize } from './Resize.js';

const d3 = require('d3');
const $ = require('jquery');

var dragHandler, neonView, info, zoomHandler;
var strokeWidth = 7;

export function setSelectStrokeWidth (width) {
  strokeWidth = width;
}

/**
 * Set the objects for this module.
 * @param {NeonView} nv - The NeonView object
 * @param {DragHandler} dh - The drag handler object
 */
export function setSelectHelperObjects (nv, dh) {
  dragHandler = dh;
  neonView = nv;
  info = neonView.info;
  zoomHandler = neonView.view.zoomHandler;
}

function escapeKeyListener (evt) {
  if (evt.key === 'Escape') {
    if ($('.selected').length > 0) {
      info.infoListeners();
    }
    unselect();
  }
}

function stopPropHandler (evt) { evt.stopPropagation(); }

/**
 * Apply listeners for click selection.
 * @param {string} selector - The CSS selector used to choose where listeners are applied.
 */
export function clickSelect (selector) {
  $(selector).off('mousedown', clickHandler);
  $(selector).on('mousedown', clickHandler);

  // Click away listeners
  $('body').off('keydown', escapeKeyListener);
  $('body').on('keydown', escapeKeyListener);

  $('#container').on('contextmenu', (evt) => { evt.preventDefault(); });

  $('use').off('click', stopPropHandler);
  $('use').on('click', stopPropHandler);
  $('rect').off('click', stopPropHandler);
  $('rect').on('click', stopPropHandler);
  $('#moreEdit').off('click', stopPropHandler);
  $('#moreEdit').on('click', stopPropHandler);
}

/**
 * Handle click events related to element selection.
 * @param {object} evt
 */
function clickHandler (evt) {
  if (!neonView) return;
  let mode = neonView.getUserMode();

  // If in insert mode or panning is active from shift key
  if (mode === 'insert' || evt.shiftKey) { return; }
  // Check if the element being clicked on is part of a drag Selection
  if (this.tagName === 'use' && getSelectionType() !== 'selByBBox') {
    if ($(this).parents('.selected').length === 0) {
      let selection = [this];
      // Check if this is part of a ligature and, if so, add all of it to the selection.
      const firstLigatureHalf = /E9B[45678]/;
      const secondLigatureHalf = /E9B[9ABC]/;
      if (this.getAttribute('xlink:href').match(secondLigatureHalf)) {
        // This is the second part of a ligature
        let nc = this.closest('.nc');
        let neume = this.closest('.neume');
        let ncIndex = Array.from(neume.children).indexOf(nc);
        let firstUse = neume.children[ncIndex - 1].children[0];
        console.assert(firstUse.getAttribute('xlink:href').match(firstLigatureHalf), 'First glyph of ligature unexpected!');
        if (firstUse.closest('.selected') === null) {
          selection.unshift(firstUse);
        }
      } else if (this.getAttribute('xlink:href').match(firstLigatureHalf)) {
        // This is the first part of a ligature
        let nc = this.closest('.nc');
        let neume = this.closest('.neume');
        let ncIndex = Array.from(neume.children).indexOf(nc);
        let secondUse = neume.children[ncIndex + 1].children[0];
        console.assert(secondUse.getAttribute('xlink:href').match(secondLigatureHalf), 'Second glyph of ligature unexpected!');
        if (secondUse.closest('.selected') === null) {
          selection.push(secondUse);
        }
      }
      if (window.navigator.userAgent.match(/Mac/) ? evt.metaKey : evt.ctrlKey) {
        selection = selection.concat(Array.from(document.getElementsByClassName('selected')));
      }
      selectAll(selection, neonView, info, dragHandler);
      if (dragHandler) {
        dragHandler.dragInit();
      }
    }
  } else if (evt.target.tagName === 'rect' && getSelectionType() === 'selByBBox') {
    if ($(this).parents('.selected').length === 0) {
      let selection = [evt.target];
      if (window.navigator.userAgent.match(/Mac/) ? evt.metaKey : evt.ctrlKey) {
        selection = selection.concat(Array.from(document.getElementsByClassName('selected')));
      }
      selectAll(selection, neonView, info, dragHandler);
      if (dragHandler) {
        dragHandler.dragInit();
      }
    }
  } else {
    // Check if the point being clicked on is a staff selection (if applicable)
    if (getSelectionType() !== 'selByStaff') {
      info.infoListeners();
      return;
    }

    // Check if the point is in a staff.
    let container = document.getElementsByClassName('active-page')[0].getElementsByClassName('definition-scale')[0];
    let pt = container.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    let transformMatrix = container.getElementsByClassName('system')[0].getScreenCTM();
    pt = pt.matrixTransform(transformMatrix.inverse());

    let selectedStaves = Array.from($('.staff')).filter((staff) => {
      let bbox = getStaffBBox(staff);
      return (bbox.ulx < pt.x && pt.x < bbox.lrx) && (bbox.uly < pt.y && pt.y < bbox.lry);
    });
    if (selectedStaves.length !== 1) {
      if ($('.selected').length > 0) {
        info.infoListeners();
      }
      unselect();
      return;
    }

    // Select a staff
    let staff = selectedStaves[0];
    if (!staff.classList.contains('selected')) {
      // Select previously unselected staff
      selectStaff(staff, dragHandler);
      let resize = new Resize(staff.id, neonView, dragHandler);
      resize.drawInitialRect();
      if (dragHandler) {
        dragHandler.dragInit();
      }
    }
    // Trigger mousedown event on the staff
    staff.dispatchEvent(new window.MouseEvent('mousedown', {
      screenX: evt.screenX,
      screenY: evt.screenY,
      clientX: evt.clientX,
      clientY: evt.clientY,
      ctrlKey: evt.ctrlKey,
      shiftKey: evt.shiftKey,
      altKey: evt.altKey,
      metaKey: evt.metaKey,
      view: evt.view
    }));
  }
}

/**
 * Apply listeners for drag selection.
 * @param {string} selector - The CSS selector used to choose where listeners are applied.
 */
export function dragSelect (selector) {
  var initialX = 0;
  var initialY = 0;
  var panning = false;
  var dragSelecting = false;
  // var canvas = d3.select('#svg_group');
  d3.selectAll(selector.replace('.active-page', '').trim())
    .on('.drag', null);
  var canvas = d3.select(selector);
  var dragSelectAction = d3.drag()
    .on('start', selStart)
    .on('drag', selecting)
    .on('end', selEnd);
  canvas.call(dragSelectAction);
  if (dragHandler) {
    dragHandler.resetTo(dragSelectAction);
  }

  function selStart () {
    if (!neonView) return;
    let userMode = neonView.getUserMode();
    if (d3.event.sourceEvent.target.nodeName !== 'use' && userMode !== 'insert' && d3.event.sourceEvent.target.nodeName !== 'rect') {
      if (!d3.event.sourceEvent.shiftKey) { // If not holding down shift key to pan
        if (!$('#selByStaff').hasClass('is-active') || pointNotInStaff(d3.mouse(this))) {
          unselect();
          dragSelecting = true;
          let initialP = d3.mouse(this);
          initialX = initialP[0];
          initialY = initialP[1];
          initRect(initialX, initialY);
        }
      } else {
        panning = true;
        if (zoomHandler !== undefined) {
          zoomHandler.startDrag();
        }
      }
    } else if (d3.event.sourceEvent.shiftKey) {
      panning = true;
      if (zoomHandler !== undefined) {
        zoomHandler.startDrag();
      }
    }
  }

  /**
   * Check if a point is in the bounds of a staff element.
   * @param {SVGPoint} point
   * @returns {boolean}
   */
  function pointNotInStaff (point) {
    let staves = Array.from(document.getElementsByClassName('staff'));
    let filtered = staves.filter((staff) => {
      let box = getStaffBBox(staff);
      return (box.ulx < point[0] && point[0] < box.lrx) && (box.uly < point[1] && point[1] < box.lry);
    });
    return (filtered.length === 0);
  }

  function selecting () {
    if (!panning && dragSelecting) {
      var currentPt = d3.mouse(this);
      var curX = currentPt[0];
      var curY = currentPt[1];

      var newX = curX < initialX ? curX : initialX;
      var newY = curY < initialY ? curY : initialY;
      var width = curX < initialX ? initialX - curX : curX - initialX;
      var height = curY < initialY ? initialY - curY : curY - initialY;

      updateRect(newX, newY, width, height);
    } else if (panning) {
      if (zoomHandler !== undefined) {
        zoomHandler.dragging();
      }
    }
  }

  function selEnd () {
    if (!panning && dragSelecting) {
      var rx = parseInt($('#selectRect').attr('x'));
      var ry = parseInt($('#selectRect').attr('y'));
      var lx = parseInt($('#selectRect').attr('x')) + parseInt($('#selectRect').attr('width'));
      var ly = parseInt($('#selectRect').attr('y')) + parseInt($('#selectRect').attr('height'));
      // Transform to the correct coordinate system
      let ul = canvas.node().createSVGPoint();
      ul.x = rx;
      ul.y = ry;
      let lr = canvas.node().createSVGPoint();
      lr.x = lx;
      lr.y = ly;
      let transform = canvas.node().getScreenCTM().inverse().multiply(canvas.select('.system').node().getScreenCTM()).inverse();
      ul = ul.matrixTransform(transform);
      lr = lr.matrixTransform(transform);

      var nc;
      if ($('#selByStaff').hasClass('is-active')) {
        nc = d3.selectAll(selector + ' use, ' + selector + ' .staff')._groups[0];
      } else if ($('#selByBBox').hasClass('is-active')) {
        nc = d3.selectAll(selector + ' .sylTextRect-display')._groups[0];
      } else {
        nc = d3.selectAll(selector + ' use')._groups[0];
      }
      var els = Array.from(nc);

      var elements = els.filter(function (d) {
        var ulx, uly, lrx, lry;
        if ($('#selByBBox').hasClass('is-active')) {
          ulx = Number($(d).attr('x'));
          uly = Number($(d).attr('y'));
          lrx = +ulx + +(d.getAttribute('width').slice(0, -2));
          lry = +uly + +(d.getAttribute('height').slice(0, -2));
          return !(((ul.x < ulx && lr.x < ulx) || (ul.x > lrx && lr.x > lrx)) || ((ul.y < uly && lr.y < uly) || (ul.y > lry && lr.y > lry)));
        } else if (d.tagName === 'use') {
          let box = d.parentNode.getBBox();
          ulx = box.x;
          uly = box.y;
          lrx = box.x + box.width;
          lry = box.y + box.height;
          return !(((ul.x < ulx && lr.x < ulx) || (ul.x > lrx && lr.x > lrx)) || ((ul.y < uly && lr.y < uly) || (ul.y > lry && lr.y > lry)));
        } else {
          let box = getStaffBBox(d);
          return !(((ul.x < box.ulx && lr.x < box.ulx) || (ul.x > box.lrx && lr.x > box.lrx)) || ((ul.y < box.uly && lr.y < box.uly) || (ul.y > box.lry && lr.y > box.lry)));
        }
      });

      // Get other halves of ligatures if only one is selected
      elements.forEach(element => {
        if (element.tagName === 'use' && element.getAttribute('xlink:href').match(/E9B[456789ABC]/)) {
          let neume = element.closest('.neume');
          let ncIndex = Array.from(neume.children).indexOf(element.closest('.nc'));
          if (element.getAttribute('xlink:href').match(/E9B[45678]/)) {
            // Add second half of ligature to selected list if not already present
            let secondNc = neume.children[ncIndex + 1];
            let secondUse = secondNc.querySelector('use');
            if (elements.indexOf(secondUse) < 0) {
              elements.push(secondUse);
            }
          } else {
            // Add first half of ligature to selected list if not already present
            let firstNc = neume.children[ncIndex - 1];
            let firstUse = firstNc.querySelector('use');
            if (elements.indexOf(firstUse) < 0) {
              elements.push(firstUse);
            }
          }
        }
      });
      selectAll(elements, neonView, info, dragHandler);

      if (dragHandler) {
        dragHandler.dragInit();
      }
      d3.selectAll('#selectRect').remove();
      dragSelecting = false;
    }
    panning = false;
  }

  /**
     * Create an initial dragging rectangle.
     * @param {number} ulx - The upper left x-position of the new rectangle.
     * @param {number} uly - The upper left y-position of the new rectangle.
     */
  function initRect (ulx, uly) {
    canvas.append('rect')
      .attr('x', ulx)
      .attr('y', uly)
      .attr('width', 0)
      .attr('height', 0)
      .attr('id', 'selectRect')
      .attr('stroke', 'black')
      .attr('stroke-width', strokeWidth)
      .attr('fill', 'none');
  }

  /**
     * Update the dragging rectangle.
     * @param {number} newX - The new ulx.
     * @param {number} newY - The new uly.
     * @param {number} currentWidth - The width of the rectangle in pixels.
     * @param {number} currentHeight - The height of the rectangle in pixels.
     */
  function updateRect (newX, newY, currentWidth, currentHeight) {
    d3.select('#selectRect')
      .attr('x', newX)
      .attr('y', newY)
      .attr('width', currentWidth)
      .attr('height', currentHeight);
  }
}
