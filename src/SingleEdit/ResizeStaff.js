/**
 * Support for resizing the staff by creating a resizable box around it.
 * @module SingleEdit/ResizeStaff
 */

import { selectStaff } from './Select.js';

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
 * Handle the resizing of the selected staff.
 * @constructor
 * @param {string} staffId - The ID of the staff to resize.
 * @param {NeonView} neonView - The NeonView parent for editing and refreshing.
 * @param {DragHandler} dragHandler - A drag handler object.
 */
function Resize (staffId, neonView, dragHandler) {
  var staff = document.getElementById(staffId);
  /**
     * The upper-left x-coordinate of the staff.
     * @type {number}
     */
  var ulx;
  /**
     * The upper-left y-coordinate of the staff.
     * @type {number}
     */
  var uly;
  /**
     * The lower-right x-coordinate of the staff.
     * @type {number}
     */
  var lrx;
  /**
     * The lower-right y-coordinate of the staff.
     * @type {number}
     */
  var lry;

  /**
     * Draw the initial rectangle around the staff
     * and add the listeners to support dragging to resize.
     */
  function drawInitialRect () {
    if (staff === null) return;
    let paths = Array.from(staff.getElementsByTagName('path'));

    paths.forEach(path => {
      let box = path.getBBox();
      if (ulx === undefined || ulx > box.x) {
        ulx = box.x;
      }
      if (uly === undefined || uly > box.y) {
        uly = box.y;
      }
      if (lrx === undefined || lrx < box.x + box.width) {
        lrx = box.x + box.width;
      }
      if (lry === undefined || lry < box.y + box.height) {
        lry = box.y + box.height;
      }
    });

    d3.select('#' + staff.id).append('rect')
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
        .on('end', resizeEnd)
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
          'elementId': staff.id,
          'ulx': ulx,
          'uly': uly,
          'lrx': lrx,
          'lry': lry
        }
      };
      neonView.edit(editorAction, 0).then((result) => {
        if (result) {
          neonView.updateForCurrentPage();
        }
        staff = document.getElementById(staffId);
        ulx = undefined;
        uly = undefined;
        lrx = undefined;
        lry = undefined;
        selectStaff(staff, dragHandler);
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
export { Resize as default };
