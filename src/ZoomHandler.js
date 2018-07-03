export default function ZoomHandler () {
    var dragCoordinates;
    var viewBox = new ViewBox();
    var matrix;

    function resetZoomAndPan () {
        viewBox.a = 0;
        viewBox.b = 0;
        viewBox.c = parseInt($("#bgimg").attr("width"));
        viewBox.d = parseInt($("#bgimg").attr("height"));
        
        $("#svg_group").attr("viewBox", viewBox.get());
    }

    function zoomTo (k) {
        getViewBox();
        viewBox.zoomTo(k, parseInt($("#bgimg").attr("width")), parseInt($("#bgimg").attr("height")));
        //$("#svg_group").attr("viewBox", viewBox.a + " " + viewBox.b + " " + viewBox.c + " " + viewBox.d);
        $("#svg_group").attr("viewBox", viewBox.get());
    }

    // Translate svg by relative x and y
    function translate (xDiff, yDiff) {
        getViewBox();
        viewBox.translate(xDiff, yDiff);
        $("#svg_group").attr("viewBox", viewBox.get());
    }

    // Restore an svg to whatever the previous
    // transformation was. Used when verovio
    // produces a new svg on each edit action
    // so it doesn't reset.
    function restoreTransformation () {
        if (viewBox.isUnset()) {
            resetZoomAndPan();
        }
        else {
        $("#svg_group").attr("viewBox", viewBox.get());
        }
    }

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

export function ViewBox () {
    var a;
    var b;
    var c;
    var d;

    function set (w, x, y, z) {
        this.a = w;
        this.b = x;
        this.c = y;
        this.d = z;
    }

    function get () {
        return this.a + " " + this.b + " " + this.c + " " + this.d;
    }

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
