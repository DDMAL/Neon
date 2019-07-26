/** @module utils/Resize */

/* for resizing objects.
 * current use cases: bounding boxes and staves
 */

import { getStaffBBox, selectBBox, selectStaff } from './SelectTools.js';

const d3 = require('d3');

/**
 * The points to put resize dragging points
 */
const PointNames = {
  TopLeft: 0,
  Top: 1,
  TopRight: 2,
  Right: 3,
  BottomRight: 4,
  Bottom: 5,
  BottomLeft: 6,
  Left: 7
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
      let rect = element.querySelector('.sylTextRect-display');
      if (rect === null) {
        console.warn("Tried to draw resize rect for a sylTextRect that doesn't exist (or isn't displaying)");
        return;
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

    var whichPoint;
    var initialPoint;

    var points = [ 
      { x: ulx, y: uly, name: PointNames.TopLeft },
      { x: (ulx + lrx) / 2, y: uly, name: PointNames.Top },
      { x: lrx, y: uly, name: PointNames.TopRight },
      { x: lrx, y: (uly + lry) / 2, name: PointNames.Right },
      { x: lrx, y: lry, name: PointNames.BottomRight },
      { x: (ulx + lrx) / 2, y: lry, name: PointNames.Bottom },
      { x: ulx, y: lry, name: PointNames.BottomLeft},
      { x: ulx, y: (uly + lry) / 2, name: PointNames.Left}
    ]

    d3.select('#' + element.id).append('rect')
      .attr('x', ulx)
      .attr('y', uly)
      .attr('width', lrx - ulx)
      .attr('height', lry - uly)
      .attr('id', 'resizeRect')
      .attr('stroke', '#0099ff')
      .attr('stroke-width', 10)
      .attr('fill', 'none')
      .style('cursor', 'move')
      .style('stroke-dasharray', '20 10');

    points.forEach((point) => {
      d3.select('#' + element.id).append('circle')
      .attr('cx', point.x)
      .attr('cy', point.y)
      .attr('r', 20)
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('fill', '#0099ff')
      .attr('class', 'resizePoint')
      .attr('id', 'p' + point.name)
      .style('zIndex', 1000);
    });

    d3.select('#' + element.id).style('zIndex', 100);

    // do it as a loop instead of selectAll so that you can easily know which point was clicked
    Object.values(PointNames).forEach((name) => {
      d3.select('#p' + name).filter('.resizePoint').call(
        d3.drag()
        .on('start', () => { resizeStart(name); })
        .on('drag', resizeDrag)
        .on('end', resizeEnd.bind(this)));
    });

    function resizeStart (name) {
      console.log(whichPoint);
      whichPoint = name;
      initialPoint = d3.mouse(this);
    }

    function resizeDrag () {
      let currentPoint = d3.mouse(this);
      switch (whichPoint) {
        case PointNames.TopLeft:
          ulx = currentPoint[0];
          uly = currentPoint[1];
          break;
        case PointNames.Top:
          uly = currentPoint[1];
          break;
        case PointNames.TopRight:
          lrx = currentPoint[0];
          uly = currentPoint[1];
          break;
        case PointNames.Right:
          lrx = currentPoint[0];
          break;
        case PointNames.BottomRight:
          lrx = currentPoint[0];
          lry = currentPoint[1];
          break;
        case PointNames.Bottom:
          lry = currentPoint[1];
          break;
        case PointNames.BottomLeft:
          ulx = currentPoint[0];
          lry = currentPoint[1];
          break;
        case PointNames.Left:
          ulx = currentPoint[0];
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
        d3.selectAll('.selectPoint').remove();
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

    var points = [ 
      { x: ulx, y: uly, name: PointNames.TopLeft },
      { x: (ulx + lrx) / 2, y: uly, name: PointNames.Top },
      { x: lrx, y: uly, name: PointNames.TopRight },
      { x: lrx, y: (uly + lry) / 2, name: PointNames.Right },
      { x: lrx, y: lry, name: PointNames.BottomRight },
      { x: (ulx + lrx) / 2, y: lry, name: PointNames.Bottom },
      { x: ulx, y: lry, name: PointNames.BottomLeft},
      { x: ulx, y: (uly + lry) / 2, name: PointNames.Left}
    ]

    points.forEach((point) => {
      d3.select('#p' + point.name).filter('.resizePoint')
      .attr('cx', point.x)
      .attr('cy', point.y)
    });
  }

  Resize.prototype.constructor = Resize;
  Resize.prototype.drawInitialRect = drawInitialRect;
}

export { Resize };
