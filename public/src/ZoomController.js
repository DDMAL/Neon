function ZoomController (neon) {
    var svg = d3.select("#svg_container");
    
    var transform = d3.zoomIdentity;
    var unitX = 10;
    var unitY = unitX;
    
    function zoomListener () {
        if (d3.event.key == "z") {
            zoom(1.25);
        }
        else if (d3.event.key == "Z") {
            zoom(0.80);
        }
        else if (d3.event.key == "ArrowUp") {
            translate(0, unitY);
        }
        else if (d3.event.key == "ArrowDown") {
            translate(0, -unitY);
        }
        else if (d3.event.key == "ArrowRight") {
            translate(-unitX, 0);
        }
        else if (d3.event.key == "ArrowLeft") {
            translate(unitX, 0);
        }
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

    ZoomController.prototype.constructor = ZoomController;
    ZoomController.prototype.zoom = zoom;
    ZoomController.prototype.translate = translate;
    ZoomController.prototype.restoreTransformation = restoreTransformation;
}
