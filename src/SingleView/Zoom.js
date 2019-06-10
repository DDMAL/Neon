/** @module SingleView/Zoom */

/**
 * Creates a Zoom Handler object.
 * @constructor ZoomHandler
 */
function ZoomHandler () {
  const d3 = require('d3');

  var dragCoordinates;
  /**
     * The internal view box of the SVG container.
     * @type {module:Zoom.ViewBox}
     */
  var viewBox;
  var matrix;

  /**
     * Reset the zoom and pan of the viewbox for the SVG.
     */
  function resetZoomAndPan () {
    let bgimg = document.getElementById('bgimg');
    viewBox = new ViewBox(parseInt(bgimg.getAttribute('width')), parseInt(bgimg.getAttribute('height')));

    updateViewBox();
  }

  /**
     * Zoom to a certain factor.
     * @param {number} k - The zoom factor.
     */
  function zoomTo (k) {
    getViewBox();
    viewBox.zoomTo(k);

    updateViewBox();
  }

  /**
     * Translate the view box by relative coordinates.
     * @param {number} xDiff - The relative x coordinate.
     * @param {number} yDiff - The relative y coordinate.
     */
  function translate (xDiff, yDiff) {
    getViewBox();
    viewBox.translate(xDiff, yDiff);
    updateViewBox();
  }

  /**
     * Restore the view box to what it was before the editor action.
     */
  function restoreTransformation () {
    if (viewBox === undefined) {
      resetZoomAndPan();
    } else {
      updateViewBox();
    }
  }

  /**
     * Get the view box from the SVG in the page.
     */
  function getViewBox () {
    if (viewBox === undefined) {
      let bgimg = document.getElementById('bgimg');
      viewBox = new ViewBox(parseInt(bgimg.getAttribute('width')), parseInt(bgimg.getAttribute('height')));
    }
    var rawViewBox = document.getElementById('svg_group').getAttribute('viewBox').split(' ');
    viewBox.set(
      parseInt(rawViewBox[0]),
      parseInt(rawViewBox[1]),
      parseInt(rawViewBox[2]),
      parseInt(rawViewBox[3])
    );
  }

  /**
     * Update the viewBox attribute of svg_group.
     */
  function updateViewBox () {
    document.getElementById('svg_group').setAttribute('viewBox', viewBox.get());
  }

  function startDrag () {
    dragCoordinates = document.getElementById('svg_group').createSVGPoint();
    if (d3.event.type === 'touchstart') {
      // If drag is triggered by a touch event
      dragCoordinates.x = d3.event.touches[0].screenX;
      dragCoordinates.y = d3.event.touches[0].screenY;
    } else {
      // Otherwise triggered by a mouse click
      dragCoordinates.x = d3.event.x;
      dragCoordinates.y = d3.event.y;
    }

    matrix = document.getElementById('svg_group').getScreenCTM().inverse();
  }

  function dragging () {
    var newCoordinates = document.getElementById('svg_group').createSVGPoint();
    // Same kind of checking as in startDrag
    if (d3.event.type === 'touchmove') {
      newCoordinates.x = d3.event.touches[0].screenX;
      newCoordinates.y = d3.event.touches[0].screenY;
    } else if (d3.event.type === 'wheel' && d3.event.shiftKey === false) {
      if (matrix === undefined) {
        matrix = document.getElementById('svg_group').getScreenCTM().inverse();
      }
      if (dragCoordinates === undefined) {
        dragCoordinates = document.getElementById('svg_group').createSVGPoint();
      }
      dragCoordinates.x = d3.event.x;
      dragCoordinates.y = d3.event.y;
      newCoordinates.x = dragCoordinates.x - d3.event.deltaX;
      newCoordinates.y = dragCoordinates.y - d3.event.deltaY;
      d3.event.preventDefault();
    } else {
      newCoordinates.x = d3.event.x;
      newCoordinates.y = d3.event.y;
    }
    let newTransform = newCoordinates.matrixTransform(matrix);
    let dragTransform = dragCoordinates.matrixTransform(matrix);
    translate(-newTransform.x + dragTransform.x, -newTransform.y + dragTransform.y);
    dragCoordinates = newCoordinates;
  }

  function scrollZoom () {
    if (d3.event.type !== 'wheel') return;
    if (!d3.event.shiftKey) {
      dragging();
      return;
    }
    let slider = document.getElementById('zoomSlider');
    getViewBox();
    let k = viewBox.getZoom();
    let newK = k - d3.event.deltaX / 100;
    if (newK < parseInt(slider.getAttribute('min')) / 100) newK = 0.25;
    if (newK > parseInt(slider.getAttribute('max')) / 100) newK = 4;
    zoomTo(newK);

    // Update zoom slider
    slider.value = newK * 100;
    document.getElementById('zoomOutput').value = parseInt(newK * 100);
  }

  ZoomHandler.prototype.constructor = ZoomHandler;
  ZoomHandler.prototype.resetZoomAndPan = resetZoomAndPan;
  ZoomHandler.prototype.zoomTo = zoomTo;
  ZoomHandler.prototype.translate = translate;
  ZoomHandler.prototype.getViewBox = getViewBox;
  ZoomHandler.prototype.restoreTransformation = restoreTransformation;
  ZoomHandler.prototype.startDrag = startDrag;
  ZoomHandler.prototype.dragging = dragging;
  ZoomHandler.prototype.scrollZoom = scrollZoom;
}

/**
 * A class representing an SVG view box.
 * @constructor
 * @param {number} imageWidth - The width of the original image in pixels.
 * @param {number} imageHeight - The height of the original image in pixels.
 */
export function ViewBox (imageWidth, imageHeight) {
  this.a = 0;
  this.b = 0;
  this.c = (imageWidth !== undefined ? imageWidth : 0);
  this.d = (imageHeight !== undefined ? imageHeight : 0);

  /**
     * Set the parameters of a view box.
     * @param {number} w - New value for a.
     * @param {number} x - New value for b.
     * @param {number} y - New value for c.
     * @param {number} z - New value for d.
     */
  function set (w, x, y, z) {
    this.a = w;
    this.b = x;
    this.c = y;
    this.d = z;
  }

  /**
     * Returns the ViewBox values in a way that can be used as an SVG attribute.
     * @returns {string}
     */
  function get () {
    return this.a + ' ' + this.b + ' ' + this.c + ' ' + this.d;
  }

  /**
     * Zoom to a certain scale.
     * @param {number} k - The zoom scale.
     */
  function zoomTo (k) {
    let zoomHeight = (imageHeight / k);
    let zoomWidth = (imageWidth / k);

    this.c = zoomWidth;
    this.d = zoomHeight;
  }

  /**
     * Get the current zoom level of the view box.
     * @returns {number}
     */
  function getZoom () {
    return imageWidth / this.c;
  }

  /**
     * Shift viewbox by (xDiff, yDiff)
     */
  function translate (xDiff, yDiff) {
    this.a += xDiff;
    this.b += yDiff;
  }

  ViewBox.prototype.constructor = ViewBox;
  ViewBox.prototype.set = set;
  ViewBox.prototype.translate = translate;
  ViewBox.prototype.zoomTo = zoomTo;
  ViewBox.prototype.get = get;
  ViewBox.prototype.getZoom = getZoom;
}

export { ZoomHandler as default };
