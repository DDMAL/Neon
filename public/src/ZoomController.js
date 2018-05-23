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
            console.log("reset zoom");
        });

        $("zoomSlider").on('change', function () {
            console.log('test');
            console.log($(this).val());
        })
    }

    // Zoom by relative k
    // newK = oldK * k
    function zoom (k) {
        selectSvgContainer();
        d3.zoom().scaleBy(svg, k);
        transform = d3.zoomTransform(svg.node());
        svg.attr("transform", transform);
    }

    // Translate svg by relative x and y
    function translate (xDiff, yDiff) {
        selectSvgContainer();
        d3.zoom().translateBy(svg, xDiff, yDiff);
        transform = d3.zoomTransform(svg.node());
        svg.attr("transform", transform);
    }

    // Restore an svg to whatever the previous
    // transformation was. Used when verovio
    // produces a new svg on each edit action
    // so it doesn't reset.
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
