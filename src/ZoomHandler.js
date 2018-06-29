export default function ZoomHandler () {
    var dragCoordinates;
    var viewBox = new ViewBox();
    var matrix;

    function resetZoomAndPan () {
        viewBox.a = 0;
        viewBox.b = 0;
        viewBox.c = parseInt($("#bgimg").attr("width"));
        viewBox.d = parseInt($("#bgimg").attr("height"));
        
        $("#svg_group").attr("viewBox", viewBox.a + " " + viewBox.b + " " + viewBox.c + " " + viewBox.d);
    }

    function zoomTo (k) {
        getViewBox();
        let zoomWidth = parseInt($("#bgimg").attr("width")) / k;
        let zoomHeight = parseInt($("#bgimg").attr("height")) / k;

        let xDiff = (viewBox.c - zoomWidth);
        let yDiff = (viewBox.d - zoomHeight);
        viewBox.c -= xDiff;
        viewBox.d -= yDiff;
        $("#svg_group").attr("viewBox", viewBox.a + " " + viewBox.b + " " + viewBox.c + " " + viewBox.d);
    }

    // Translate svg by relative x and y
    function translate (xDiff, yDiff) {
        getViewBox();
        viewBox.a += xDiff;
        viewBox.b += yDiff;
        $("#svg_group").attr("viewBox", viewBox.a + " " + viewBox.b + " " + viewBox.c + " " + viewBox.d);
    }

    // Restore an svg to whatever the previous
    // transformation was. Used when verovio
    // produces a new svg on each edit action
    // so it doesn't reset.
    function restoreTransformation () {
        $("#svg_group").attr("viewBox", viewBox.a + " " + viewBox.b + " " + viewBox.c + " " + viewBox.d);
    }

    function getViewBox () {
        var rawViewBox = $("#svg_group").attr("viewBox").split(" ");
        viewBox.a = parseInt(rawViewBox[0]);
        viewBox.b = parseInt(rawViewBox[1]);
        viewBox.c = parseInt(rawViewBox[2]);
        viewBox.d = parseInt(rawViewBox[3]);
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

function ViewBox () {
    var a;
    var b;
    var c;
    var d;

    ViewBox.prototype.constructor = ViewBox;
}
