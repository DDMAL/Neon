/** @module Zoom */

/**
 * Creates a Zoom Handler object.
 * @constructor ZoomHandler
 */
function ZoomHandler () {
    var dragCoordinates;
    /**
     * The internal view box of the SVG container.
     * @type {module:Zoom.ViewBox}
     */
    var viewBox = new ViewBox();
    var matrix;

    /**
     * Reset the zoom and pan of the viewbox for the SVG.
     */
    function resetZoomAndPan () {
        viewBox.a = 0;
        viewBox.b = 0;
        viewBox.c = parseInt($("#bgimg").attr("width"));
        viewBox.d = parseInt($("#bgimg").attr("height"));

        $("#svg_group").attr("viewBox", viewBox.get());
    }

    /**
     * Zoom to a certain factor.
     * @param {number} k - The zoom factor.
     */
    function zoomTo (k) {
        getViewBox();
        viewBox.zoomTo(k, parseInt($("#bgimg").attr("width")), parseInt($("#bgimg").attr("height")));
        //$("#svg_group").attr("viewBox", viewBox.a + " " + viewBox.b + " " + viewBox.c + " " + viewBox.d);
        $("#svg_group").attr("viewBox", viewBox.get());
    }

    /**
     * Translate the view box by relative coordinates.
     * @param {number} xDiff - The relative x coordinate.
     * @param {number} yDiff - The relative y coordinate.
     */
    function translate (xDiff, yDiff) {
        getViewBox();
        viewBox.translate(xDiff, yDiff);
        $("#svg_group").attr("viewBox", viewBox.get());
    }

    /**
     * Restore the view box to what it was before the editor action.
     */
    function restoreTransformation () {
        if (viewBox.isUnset()) {
            resetZoomAndPan();
        }
        else {
        $("#svg_group").attr("viewBox", viewBox.get());
        }
    }

    /**
     * Get the view box from the SVG in the page.
     */
    function getViewBox () {
        var rawViewBox = $("#svg_group").attr("viewBox").split(" ");
        viewBox.set(
            parseInt(rawViewBox[0]),
            parseInt(rawViewBox[1]),
            parseInt(rawViewBox[2]),
            parseInt(rawViewBox[3])
        );
    }


    function startDrag () {
        dragCoordinates = document.getElementById("svg_group").createSVGPoint();
        dragCoordinates.x = d3.event.x;
        dragCoordinates.y = d3.event.y;

        matrix = document.getElementById("svg_group").getScreenCTM().inverse();
        dragCoordinates = dragCoordinates.matrixTransform(matrix);
    }

    function dragging () {
        var newCoordinates = document.getElementById("svg_group").createSVGPoint();
        newCoordinates.x = d3.event.x;
        newCoordinates.y = d3.event.y;
        newCoordinates = newCoordinates.matrixTransform(matrix);
        translate(-newCoordinates.x + dragCoordinates.x, -newCoordinates.y + dragCoordinates.y);
        dragCoordinates = newCoordinates;
    }

    ZoomHandler.prototype.constructor = ZoomHandler;
    ZoomHandler.prototype.resetZoomAndPan = resetZoomAndPan;
    ZoomHandler.prototype.zoomTo = zoomTo;
    ZoomHandler.prototype.translate = translate;
    ZoomHandler.prototype.getViewBox = getViewBox;
    ZoomHandler.prototype.restoreTransformation = restoreTransformation;
    ZoomHandler.prototype.startDrag = startDrag;
    ZoomHandler.prototype.dragging = dragging;
}

/**
 * A class representing an SVG view box.
 * @constructor
 */
export function ViewBox () {
    var a;
    var b;
    var c;
    var d;

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
        return this.a + " " + this.b + " " + this.c + " " + this.d;
    }

    /**
     * Zoom to a certain scale.
     * @param {number} k - The zoom scale.
     * @param {number} imageHeight - The height of the original image in pixels.
     * @param {number} imageWidth - The width of the original image in pixels.
     */
    function zoomTo(k, imageHeight, imageWidth) {
        let zoomHeight = (imageWidth / k);
        let zoomWidth = (imageHeight / k);

        this.c = zoomWidth;
        this.d = zoomHeight;
    }

    /**
     * Shift viewbox by (xDiff, yDiff)
     */
    function translate (xDiff, yDiff) {
        this.a += xDiff;
        this.b += yDiff;
    }

    /**
     * Check if any ViewBox parameters are unset.
     * @returns {boolean}
     */
    function isUnset () {
        return (this.a === undefined || this.b === undefined || this.c === undefined || this.d === undefined);
    }

    ViewBox.prototype.constructor = ViewBox;
    ViewBox.prototype.set = set;
    ViewBox.prototype.translate = translate;
    ViewBox.prototype.isUnset = isUnset;
    ViewBox.prototype.zoomTo = zoomTo;
    ViewBox.prototype.get = get;
}

export {ZoomHandler as default};
