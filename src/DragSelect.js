export default function DragSelect (dragHandler, zoomHandler) {
    var initialX = 0;
    var initialY = 0;
    var panning = false;
    var dragSelecting = false;

    var canvas = d3.select("#svg_group");

    canvas.call(
        d3.drag()
            .on("start", selStart)
            .on("drag", selecting)
            .on("end", selEnd)
    );

    function selStart(){
        if (d3.event.sourceEvent.target.nodeName != "use"){
            if(!d3.event.sourceEvent.shiftKey){
                dragSelecting = true;
                var initialP = d3.mouse(this);
                initialX = initialP[0];
                initialY = initialP[1];
                initRect(initialX, initialY);
            }
            else {
                panning = true;
                zoomHandler.startDrag();
            }    
        }
    }

    function selecting(){
        if(!panning && dragSelecting){
            var currentPt = d3.mouse(this);
            var curX = currentPt[0];
            var curY = currentPt[1];
            
            var newX = curX<initialX?curX:initialX;
            var newY = curY<initialY?curY:initialY;
            var width = curX<initialX?initialX-curX:curX-initialX;
            var height = curY<initialY?initialY-curY:curY-initialY;

            updateRect(newX, newY, width, height);
        }
        else if(panning){
            zoomHandler.dragging();
        }
    }

    function selEnd(){
        if(!panning && dragSelecting){
            var finalPt = d3.mouse(this);
            var finalX = finalPt[0];
            var finalY = finalPt[1];

            var nc = d3.selectAll("use")._groups[0];
            var els = Array.from(nc);
            
            var elements = els.filter(function(d){
                var elX = d.x.baseVal.value;
                var elY = d.y.baseVal.value;
                return elX > initialX && elX < finalX 
                    && elY > initialY && elY < finalY;
            });

            elements.map(function(el){
                var parent = $(el).parent()[0];
                d3.select(parent)
                    .attr("fill", "#d00")
                    .attr("class", "nc selected");
            })
            dragHandler.dragInit();
            d3.selectAll("#selectRect").remove();
            dragSelecting = false;
        }
        panning = false;
    }

    function initRect(ulx, uly){
        canvas.append("rect")
            .attr("x", ulx)
            .attr("y", uly)
            .attr("width", 0)
            .attr("height", 0)
            .attr("id", "selectRect")
            .attr("stroke", "black")
            .attr("stroke-width", 7)
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