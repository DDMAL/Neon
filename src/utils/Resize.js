/** @module for resizing objects
 * current use cases: bounding boxes and staves
 */

import { getStaffBBox, selectBBox, selectStaff } from './SelectTools.js';

const d3 = require('d3');

/**
 * The sides of the rectangle
 */
const Side = {
  Top: 0,
  Bottom: 1,
  Left: 2,
  Right: 3
};

/**
 * Handle the resizing of the selected object.
 * @constructor
 * @param {string} elementId - The ID of the element to resize.
 * @param {NeonView} neonView - The NeonView parent for editing and refreshing.
 * @param {DragHandler} dragHandler - A drag handler object.
 */
function Resize (elementId, neonView, dragHandler) {
  var element = document.getElementById(elementId);
  /**
     * The upper-left x-coordinate of the element.
     * @type {number}
     */
  var ulx;
  /**
     * The upper-left y-coordinate of the element.
     * @type {number}
     */
  var uly;
  /**
     * The lower-right x-coordinate of the element.
     * @type {number}
     */
  var lrx;
  /**
     * The lower-right y-coordinate of the element.
     * @type {number}
     */
  var lry;

  /**
     * Draw the initial rectangle around the element
     * and add the listeners to support dragging to resize.
     */
  function drawInitialRect () {
    if (element === null) return;

    // if it's a boundingbox just get the coordinates
    if (element.classList.contains('syl')) {
      let rect = element.querySelector('.sylTextRect-select');
      if (rect === null) {
        rect = element.querySelector('.sylTextRect-display');
      }
      if (rect === null) {
        rect = element.querySelector('.sylTextRect');
      }
      ulx = Number(rect.getAttribute('x'));
      uly = Number(rect.getAttribute('y'));
      lrx = +ulx + +rect.getAttribute('width');
      lry = +uly + +rect.getAttribute('height');
    }

    // if it's a staff use the paths to get it's boundingbox
    if (element.classList.contains('staff')) {
      var bbox = getStaffBBox(element);
      ulx = bbox.ulx;
      uly = bbox.uly;
      lrx = bbox.lrx;
      lry = bbox.lry;
    }

    d3.select('#' + element.id).append('rect')
      .attr('x', ulx)
      .attr('y', uly)
      .attr('width', lrx - ulx)
      .attr('height', lry - uly)
      .attr('id', 'resizeRect')
      .attr('stroke', 'black')
      .attr('stroke-width', 15)
      .attr('fill', 'none')
      .style('cursor', 'move');

    d3.select('#resizeRect').call(
      d3.drag()
        .on('start', resizeStart)
        .on('drag', resizeDrag)
        .on('end', resizeEnd.bind(this))
    );

    var side;
    var initialPoint;

    function resizeStart () {
      initialPoint = d3.mouse(this);
      {
        let dist = Math.abs(initialPoint[0] - ulx);
        side = Side.Left;
        if (dist > Math.abs(initialPoint[0] - lrx)) {
          dist = Math.abs(initialPoint[0] - lrx);
          side = Side.Right;
        }
        if (dist > Math.abs(initialPoint[1] - uly)) {
          dist = Math.abs(initialPoint[1] - uly);
          side = Side.Top;
        }
        if (dist > Math.abs(initialPoint[1] - lry)) {
          dist = Math.abs(initialPoint[1] - lry);
          side = Side.Bottom;
        }
      }
    }

    function resizeDrag () {
      let currentPoint = d3.mouse(this);
      switch (side) {
        case Side.Left:
          ulx = currentPoint[0];
          break;
        case Side.Right:
          lrx = currentPoint[0];
          break;
        case Side.Top:
          uly = currentPoint[1];
          break;
        case Side.Bottom:
          lry = currentPoint[1];
          break;
        default:
          console.error("Something that wasn't a side of the rectangle was dragged. This shouldn't happen.");
      }
      redraw();
    }

    function resizeEnd () {
      let editorAction = {
        'action': 'resize',
        'param': {
          'elementId': element.id,
          'ulx': ulx,
          'uly': uly,
          'lrx': lrx,
          'lry': lry
        }
      };
      neonView.edit(editorAction, neonView.view.getCurrentPageURI()).then(async (result) => {
        if (result) {
          await neonView.updateForCurrentPagePromise();
        }
        element = document.getElementById(elementId);
        ulx = undefined;
        uly = undefined;
        lrx = undefined;
        lry = undefined;
        if (element.classList.contains('syl')) {
          selectBBox(element.querySelector('.sylTextRect-display'), dragHandler, this);
        } else {
          selectStaff(element, dragHandler);
        }
        drawInitialRect();
      });
    }
  }

  /**
     * Redraw the rectangle with the new bounds
     */
  function redraw () {
    d3.select('#resizeRect')
      .attr('x', ulx)
      .attr('y', uly)
      .attr('width', lrx - ulx)
      .attr('height', lry - uly);
  }

  Resize.prototype.constructor = Resize;
  Resize.prototype.drawInitialRect = drawInitialRect;
}

export { Resize };
