export default function DragSelect () {
    var selectRect = {
        initialX : 0,
        initialY : 0,
    }

    var canvas = d3.select("#svg_group");

    canvas.call(
        d3.drag()
            .on("start", selStart)
            .on("drag", selecting)
            .on("end", selEnd)
    );

    function selStart(){
        var initialP = d3.mouse(this);
        selectRect.initialX = initialP[0];
        selectRect.initialY = initialP[1];
        initRect(selectRect.initialX, selectRect.initialY);    
    }

    function selecting(){
        var currentPt = d3.mouse(this);
        var curX = currentPt[0];
        var curY = currentPt[1];
        var initialX = selectRect.initialX;
        var initialY = selectRect.initialY;
        var newX = curX<initialX?curX:initialX;
        var newY = curY<initialY?curY:initialY;
        var width = curX<initialX?initialX-curX:curX-initialX;
        var height = curY<initialY?initialY-curY:curY-initialY;

        updateRect(newX, newY, width, height);
    }

    function selEnd(){
        d3.selectAll("#selectRect").remove();
    }

    function initRect(ulx, uly){
        canvas.append("rect")
            .attr("x", ulx)
            .attr("y", uly)
            .attr("width", 0)
            .attr("height", 0)
            .attr("id", "selectRect")
            .attr("stroke", "black")
            .attr("stroke-width", 10)
            .attr("stroke-dasharray", 10,10)
            .attr("fill", "none");
    }

    function updateRect(newX, newY, currentWidth, currentHeight){
        d3.select("#selectRect")
            .attr("x", newX)
            .attr("y", newY)
            .attr("width", currentWidth)
            .attr("height", currentHeight)
    }
}