function ZoomHandler (neon) {

    /////////////// 
    // Constructor
    //////////////

    var transform = d3.zoomIdentity;
    var dragCoordinates = [0.0, 0.0];

    /////////////// 
    // Functions 
    //////////////

    // Resets SVG transformation
    // Scaling at 1.0
    // Translation to half of page height/width
    function resetZoomAndPan () {
        var svg = selectSvgContainer();
        d3.zoom().scaleTo(svg, 1);
        transform = d3.zoomTransform(svg.node());
        svg.attr("transform", transform);
        $("#zoomSlider").val(100);
        $("#zoomOutput").val(100);

        d3.zoom().translateTo(svg, neon.pageWidth/2, neon.pageHeight/2);
        transform = d3.zoomTransform(svg.node());
        svg.attr("transform", transform);
    }

    // Zoom by relative k
    // newK = oldK * k
    function zoom (k) {
        var svg = selectSvgContainer();
        d3.zoom().scaleBy(svg, k);
        transform = d3.zoomTransform(svg.node());
        svg.attr("transform", transform);
    }

    function zoomTo (k) {
        var svg = selectSvgContainer();
        d3.zoom().scaleTo(svg, k);
        transform = d3.zoomTransform(svg.node());
        svg.attr("transform", transform);
    }

    // Translate svg by relative x and y
    function translate (xDiff, yDiff) {
        var svg = selectSvgContainer();
        d3.zoom().translateBy(svg, xDiff, yDiff);
        transform = d3.zoomTransform(svg.node());
        svg.attr("transform", transform);
    }

    // Restore an svg to whatever the previous
    // transformation was. Used when verovio
    // produces a new svg on each edit action
    // so it doesn't reset.
    function restoreTransformation () {
        var svg = selectSvgContainer();
        d3.zoom().transform(svg, transform);
        svg.attr("transform", d3.zoomTransform(svg.node()));
    }

    function selectSvgContainer () {
        return d3.select("#svg_group");
    }

    // D3 drag listeners (for panning)

    function startDrag () {
        dragCoordinates = [d3.event.x, d3.event.y];
    }

    function dragging () {
        translate(
            (d3.event.x - dragCoordinates[0]) / transform.k,
            (d3.event.y - dragCoordinates[1]) / transform.k
        );
        dragCoordinates[0] = d3.event.x;
        dragCoordinates[1] = d3.event.y;
    }

    ZoomHandler.prototype.constructor = ZoomHandler;
    ZoomHandler.prototype.resetZoomAndPan = resetZoomAndPan;
    ZoomHandler.prototype.zoom = zoom;
    ZoomHandler.prototype.zoomTo = zoomTo;
    ZoomHandler.prototype.translate = translate;
    ZoomHandler.prototype.restoreTransformation = restoreTransformation;
    ZoomHandler.prototype.startDrag = startDrag;
    ZoomHandler.prototype.dragging = dragging;
}
