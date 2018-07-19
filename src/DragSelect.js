import ColorStaves, {highlight, unhighlight} from "./ColorStaves.js";

/**
 * Handle dragging to select musical elements and staves.
 * @constructor
 * @param {DragHandler} dragHandler - Instantiated DragHandler object.
 * @param {module:ZoomHandler~ZoomHandler} zoomHandler - Instantiated ZoomHandler object.
 * @param {GroupingHandler} groupingHandler - Instantiated GroupingHandler object.
 */
function DragSelect (dragHandler, zoomHandler, groupingHandler) {
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

    /**
     * Start drag selecting musical elements.
     */
    function selStart(){
        var editing = false;
        var insertEls = Array.from(d3.selectAll(".insertel")._groups[0]);
        insertEls.forEach(el => {
            if ($(el).hasClass("is-active")){
                editing = true;
            }
        })
        if (d3.event.sourceEvent.target.nodeName != "use" && !editing){
            if(!d3.event.sourceEvent.shiftKey){
                unselect();
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
        editing = false;
    }

    /**
     * Action to run while the drag select continues. Updates the rectangle.
     */
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

    /**
     * Finish the selection and mark elements within the rectangle as being selected.
     */
    function selEnd(){
        if(!panning && dragSelecting){
            var rx = parseInt($("#selectRect").attr("x"));
            var ry = parseInt($("#selectRect").attr("y"));
            var lx = parseInt($("#selectRect").attr("x")) + parseInt($("#selectRect").attr("width"));
            var ly = parseInt($("#selectRect").attr("y")) + parseInt($("#selectRect").attr("height"));

            var nc;
            if ($("#selByStaff").hasClass("is-active")) {
                nc = d3.selectAll("use, .staff")._groups[0];
            } else {
                nc = d3.selectAll("use")._groups[0];
            }
            var els = Array.from(nc);
            
            var elements = els.filter(function(d){
                var elX, elY;
                if (d.tagName === "use") {
                    elX = d.x.baseVal.value;
                    elY = d.y.baseVal.value;
                } else {
                    elX = d.getBBox().x;
                    elY = d.getBBox().y;
                }
                return elX > rx && elX < lx  && elY > ry && elY < ly;
            });

            var toSelect = [];

            if ($("#selByStaff").hasClass("is-active")) {
                elements.forEach(el => {
                    if (el.tagName === "use") {
                        toSelect.push($(el).parents(".staff")[0]);
                    } else {
                        toSelect.push(el);
                    }
                });
                toSelect.forEach(elem => {
                    highlight(elem, "#d00");
                    $(elem).addClass("selected");
                });
            }
            else {
                elements.forEach(el => {
                    var parent = $(el).parent()[0];
                    var isNc = !($(parent).hasClass("clef") || $(parent).hasClass("custos"));

                    if($(parent).hasClass("selected")){
                        return;
                    }

                    toSelect.push(parent);

                    if(d3.select("#selByNeume").classed("is-active") && isNc){
                        var siblings = Array.from($(parent).siblings());
                        siblings.forEach(el => {
                            var cls = d3.select("#" + el.id).attr("class");
                            if(cls == "nc"){
                                toSelect.push(el);
                            }   
                        })
                    }     
                    toSelect.forEach(nc => {
                        $("#" + nc.id).addClass("selected");
                        $("#" + nc.id).attr("fill", "#d00");
                    });               
                });
            }
            if (toSelect.length > 1 && !$("#selByStaff").hasClass("is-active")){
                groupingHandler.triggerGroupSelection();
            }  
            dragHandler.dragInit();
            d3.selectAll("#selectRect").remove();
            dragSelecting = false;
        }
        panning = false;
    }

    /**
     * Create an initial dragging rectangle.
     * @param {number} ulx - The upper left x-position of the new rectangle.
     * @param {number} uly - The upper left y-position of the new rectangle.
     */
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

    /**
     * Update the dragging rectangle.
     * @param {number} newX - The new ulx.
     * @param {number} newY - The new uly.
     * @param {number} currentWidth - The width of the rectangle in pixels.
     * @param {number} currentHeight - The height of the rectangle in pixels.
     */
    function updateRect(newX, newY, currentWidth, currentHeight){
        d3.select("#selectRect")
            .attr("x", newX)
            .attr("y", newY)
            .attr("width", currentWidth)
            .attr("height", currentHeight)
    }

    /**
     * Unselect all selected elements and run undo any extra
     * actions.
     */
    function unselect() {
        var selected = $(".selected");
        for (var i=0; i < selected.length; i++) {
            if ($(selected[i]).hasClass("staff")) {
                $(selected[i]).removeClass("selected");
                unhighlight(selected[i]);
            } else {
                $(selected[i]).removeClass("selected").attr("fill", null);
            }
        }
        if (!$("#selByStaff").hasClass("is-active")) {
            groupingHandler.endGroupingSelection();
        }
        if ($("#highlightStaves").is(":checked")) {
            let color = new ColorStaves();
            color.setColor();
        }
    }
}

export {DragSelect as default};
