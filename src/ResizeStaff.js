const Side = {
    Top: 0,
    Bottom: 1,
    Left: 2,
    Right: 3
};

function Resize(staffId) {
    var staff = document.getElementById(staffId);
    var ulx, uly, lrx, lry;

    function drawInitialRect() {
        if (staff === null) return;
        let paths = Array.from(staff.getElementsByTagName("path"));

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

        d3.select("#" + staff.id).append("rect")
            .attr("x", ulx)
            .attr("y", uly)
            .attr("width", lrx - ulx)
            .attr("height", lry - uly)
            .attr("id", "resizeRect")
            .attr("stroke", "black")
            .attr("stroke-width", 15)
            .attr("fill", "none")
            .style("cursor", "move");

        d3.select("#resizeRect").call(
            d3.drag()
             .on("start", resizeStart)
             .on("drag", resizeDrag)
             .on("end", resizeEnd)
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
            console.log(side);
            console.log(initialPoint);
        }

        function resizeDrag () {
            let currentPoint = d3.mouse(this);
            switch(side) {
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
        }
    }

    function redraw() {
        d3.select("#resizeRect")
            .attr("x", ulx)
            .attr("y", uly)
            .attr("width", lrx - ulx)
            .attr("height", lry - uly);
    }

    Resize.prototype.constructor = Resize;
    Resize.prototype.drawInitialRect = drawInitialRect;
}
export {Resize as default};
