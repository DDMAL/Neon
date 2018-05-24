function ZoomController (neon) {
    var svg = d3.select("#svg_container");
    
    var transform = d3.zoomIdentity;
    var unitX = 10;
    var unitY = unitX;
    var dragCoordinates = [0.0, 0.0];
    setZoomControls();

    // TODO: Finish functionality for zoom controls
    function setZoomControls() {
        $("#reset-zoom").click( function() {
            resetZoomAndPan();
        });

        $("zoomSlider").on('change', function () {
            console.log('test');
            console.log($(this).val());
        })
    }

    function resetZoomAndPan () {
        selectSvgContainer();
        d3.zoom().scaleTo(svg, 1);
        transform = d3.zoomTransform(svg.node());
        svg.attr("transform", transform);

        d3.zoom().translateTo(svg, neon.pageWidth/2, neon.pageHeight/2);
        transform = d3.zoomTransform(svg.node());
        svg.attr("transform", transform);
    }

    function zoom (k) {
        selectSvgContainer();
        d3.zoom().scaleBy(svg, k);
        transform = d3.zoomTransform(svg.node());
        svg.attr("transform", transform);
    }

    function translate (xDiff, yDiff) {
        selectSvgContainer();
        d3.zoom().translateBy(svg, xDiff, yDiff);
        transform = d3.zoomTransform(svg.node());
        svg.attr("transform", transform);
    }

    function restoreTransformation () {
        selectSvgContainer();
        d3.zoom().transform(svg, transform);
        svg.attr("transform", d3.zoomTransform(svg.node()));
    }

    function selectSvgContainer () {
        svg = d3.select("#svg_container");
    }

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

    ZoomController.prototype.constructor = ZoomController;
    ZoomController.prototype.zoom = zoom;
    ZoomController.prototype.translate = translate;
    ZoomController.prototype.restoreTransformation = restoreTransformation;
    ZoomController.prototype.startDrag = startDrag;
    ZoomController.prototype.dragging = dragging;
}
