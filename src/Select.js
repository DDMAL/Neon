/** @module Select */

import * as Color from "./Color.js";
import * as Contents from "./Contents.js";
import * as Controls from "./Controls.js";
import * as Grouping from "./Grouping.js";

/**
 * Handle click selection and mark elements as selected.
 * @constructor
 * @param {DragHandler} dragHandler - An instantiated DragHandler object.
 * @param {NeonView} neonView - The NeonView parent.
 */
export function ClickSelect (dragHandler, neonView) {
    var lastSelect = new Array(0);
    selectListeners();
    
    //Selection mode toggle
    function selectListeners() {
        var classesToSelect = ".nc, .clef, .custos";
        Controls.initSelectionButtons();

        //Activating selected neumes
        $(classesToSelect).on("click", function() {
            var isNc= $(this).hasClass("nc");
            if ($("#selByNeume").hasClass("is-active") && isNc){
                if(!$(this).hasClass("selected")){
                    unselect();
                    $(this).attr("fill", "#d00");
                    $(this).addClass("selected");
                    var siblings = Array.from($(this).siblings());
                    siblings.forEach(el => {
                        if(!$(el).hasClass("selected")){
                            $(el).attr("fill", "#d00");
                            $(el).addClass("selected");
                        }   
                    }) 
                    if(siblings.length != 0){
                        triggerNeumeActions();  
                    }     
                    else{
                        triggerNcActions(neonView);
                    }          
                    dragHandler.dragInit();   
                }
            }
            else if ($("#selByNc").hasClass("is-active") || !(isNc || $("#selByStaff").hasClass("is-active"))){
                if(!$(this).hasClass("selected")){
                    unselect();
                    $(this).attr("fill", "#d00");
                    $(this).addClass("selected");
                    triggerNcActions(neonView);
                    dragHandler.dragInit();
                }
            }
            else if ($("#selByStaff").hasClass("is-active")) {
                var staff = $(this).parents(".staff");
                if (!staff.hasClass("selected")) {
                    unselect();
                    staff.addClass("selected");
                    Color.highlight(staff[0], "#d00");
                    triggerStaffActions(neonView);
                    dragHandler.dragInit();
                }
            }
            else {
                console.log("error: selection mode not activated");
                return;
            }
            lastSelect = Array.from($(".selected"));
        })

        // click away listeners
        $("body").on("keydown", (evt) => { // click
            if (evt.type === "keydown" && evt.key !== "Escape") return;
            endOptionsSelection();
            unselect();
        })

        $(classesToSelect).on("click", function(e){
            e.stopPropagation();
        })

        $("#moreEdit").on("click", function(e) {
            e.stopPropagation();
        })
    }
    ClickSelect.prototype.selectListeners = selectListeners;
}

function endOptionsSelection () {
    $("#moreEdit").empty();
    $("#moreEdit").addClass("is-invisible");
}

function initOptionsListeners(){
    $("#drop_select").on("click", function() {
        $(this).toggleClass("is-active");
    })
}

//TODO: CHANGE NAVABAR-LINK TO PROPER ICON//
function triggerNcActions(neonView) {
    endOptionsSelection();
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(Contents.ncActionContents);
    
    $("#Punctum.dropdown-item").on("click", (evt) => {
        let unsetInclinatum = {
            "action": "set",
            "param": {
                "elementId": lastSelect[0].id,
                "attrType": "name",
                "attrValue": ""
            }
        };
        let unsetVirga = {
            "action": "set",
            "param": {
                "elementId": lastSelect[0].id,
                "attrType": "diagonalright",
                "attrValue": ""
            }
        };
        neonView.edit({ "action": "chain", "param": [ unsetInclinatum, unsetVirga ]});
        neonView.refreshPage();
    });

    $("#Inclinatum.dropdown-item").on("click", (evt) => {
        let setInclinatum = {
            "action": "set",
            "param": {
                "elementId": lastSelect[0].id,
                "attrType": "name",
                "attrValue": "inclinatum"
            }
        };
        let unsetVirga = {
            "action": "set",
            "param": {
                "elementId": lastSelect[0].id,
                "attrType": "diagonalright",
                "attrValue": ""
            }
        };
        neonView.edit({ "action": "chain", "param": [ setInclinatum, unsetVirga ]});
        neonView.refreshPage();
    });
    
    $("#Virga.dropdown-item").on("click", (evt) => {
        let unsetInclinatum = {
            "action": "set",
            "param": {
                "elementId": lastSelect[0].id,
                "attrType": "name",
                "attrValue": ""
            }
        };
        let setVirga = {
            "action": "set",
            "param": {
                "elementId": lastSelect[0].id,
                "attrType": "diagonalright",
                "attrValue": "u"
            }
        };
        neonView.edit({ "action": "chain", "param": [ unsetInclinatum, setVirga ]});
        neonView.refreshPage();
    });

    initOptionsListeners();
}

//TODO: CHANGE NAVABAR-LINK TO PROPER ICON//
function triggerNeumeActions() {
    endOptionsSelection()
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(Contents.neumeActionContents);

    initOptionsListeners();
}

function triggerStaffActions(neonView) {
    endOptionsSelection();
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(Contents.staffActionContents);
    
    $("#drop_select").on("click", function() {
        $(this).toggleClass("is-active");
    });
    $("#merge-systems").on("click", (evt) => {
        let systems = Array.from($(".staff.selected"));
        let elementIds = [];
        systems.forEach(staff => {
            elementIds.push(staff.id);
        });
        let editorAction = {
            "action": "merge",
            "param": {
                "elementIds": elementIds
            }
        };

        if (neonView.edit(editorAction)) {
            neonView.refreshPage();
        }
        else {
            alert("Could not merge systems. :(");
        }
    });
    initOptionsListeners();
}

/**
 * Handle dragging to select musical elements and staves.
 * @constructor
 * @param {DragHandler} dragHandler - Instantiated DragHandler object.
 * @param {module:Zoom~ZoomHandler} zoomHandler - Instantiated ZoomHandler object.
 * @param {NeonView} neonView - NeonView parent.
 */
export function DragSelect (dragHandler, zoomHandler, neonView) {
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
                    Color.highlight(elem, "#d00");
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
                Grouping.triggerGroupSelection();
            } 
            else if (toSelect.length > 1 && $("#selByStaff").hasClass("is-active")) {
                triggerStaffActions(neonView);
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
            Color.unhighlight(selected[i]);
        } else {
            $(selected[i]).removeClass("selected").attr("fill", null);
        }
    }
    if (!$("#selByStaff").hasClass("is-active")) {
        Grouping.endGroupingSelection();
    }
    if ($("#highlightStaves").is(":checked")) {
        Color.setStaffHighlight();
    }
}
