/** @module Select */

import * as Color from "./Color.js";
import * as Contents from "./Contents.js";
import * as Controls from "./Controls.js";
import * as Grouping from "./Grouping.js";
import * as SelectOptions from "./SelectOptions.js";

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
            if(!isNc && !($("#selByStaff").hasClass("is-active"))){
                if ($(this).hasClass("clef")){
                    selectClefs(this, dragHandler);
                }
                else if($(this).hasClass("custos")){
                    selectNcs(this, dragHandler, lastSelect);
                }
            }
            else if ($("#selBySyl").hasClass("is-active") && isNc) {
                var neumeParent = $(this).parent();
                if($(neumeParent).hasClass("neume")){
                    var parentSiblings = Array.from($(neumeParent).siblings());
                    if(parentSiblings.length != 0){
                        selectSyl(neumeParent, dragHandler);
                    }
                    else{
                        selectNeumes(this, dragHandler);
                    }
                }
                else{
                    console.log("Error: parent should be neume.");
                }
            }
            else if ($("#selByNeume").hasClass("is-active") && isNc){
                var siblings = Array.from($(this).siblings());
                if(siblings.length != 0) {
                    selectNeumes(this, dragHandler);
                }
                else{
                    selectNcs(this, dragHandler, lastSelect);
                }
            }
            else if ($("#selByNc").hasClass("is-active") && isNc){
                selectNcs(this, dragHandler, lastSelect);
            }
            else if ($("#selByStaff").hasClass("is-active")) {
                var staff = $(this).parents(".staff");
                if (!staff.hasClass("selected")) {
                    unselect();
                    staff.addClass("selected");
                    Color.highlight(staff[0], "#d00");
                    SelectOptions.triggerStaffActions();
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
            SelectOptions.endOptionsSelection();
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

            var syls = [];
            var neumes = [];
            var ncs = [];
            var notNeumes = [];

            elements.forEach(el => {
                var firstParent = $(el).parent()[0];
                var isNc = $(firstParent).hasClass("nc");

                if (isNc) {
                    ncs.push(firstParent);

                    var neume = $(firstParent).parent()[0];
                    if (!neumes.includes(neume)) {
                        neumes.push(neume);
                    }

                    var syl = $(neume).parent()[0];
                    if (!syls.includes(syl)) {
                        syls.push(syl);
                    }
                }
                else {
                    notNeumes.push(firstParent);
                }
            });

            var selectMode = null;
            var tabs = Array.from($(".sel-by"));
            tabs.forEach(tab => {
                if ($(tab).hasClass("is-active")) {
                    selectMode = $(tab)[0].id;
                }
            });

            if (selectMode == "selByStaff") {
                var toSelect = [];
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
                SelectOptions.triggerStaffActions();
            }
            else if (selectMode === "selBySyl") {
                var noClefOrCustos = selectNn(notNeumes);
                syls.forEach(s => {
                    select(s);
                });
                if (syls.length > 1 && noClefOrCustos) {
                    Grouping.triggerGrouping("syl");
                }
                else if (syls.length === 1 && noClefOrCustos) {
                    SelectOptions.triggerSylActions();
                }
                else {
                    console.log("Warning: no selection made");
                }
            }
            else if (selectMode === "selByNeume") {
                var noClefOrCustos = selectNn(notNeumes);
                neumes.forEach(n => {
                    select(n);
                });
                if (neumes.length > 1 && noClefOrCustos) {
                    Grouping.triggerGrouping("neume");
                }
                else if (neumes.length == 1 && noClefOrCustos) {
                    SelectOptions.triggerNeumeActions();
                }
                else {
                    console.log("no selection made");
                }
            }
            else if (selectMode === "selByNc") {
                var noClefOrCustos = selectNn(notNeumes);
                ncs.forEach(nc => {
                    select(nc);
                });
                if (ncs.length === 2 && noClefOrCustos) {
                    Grouping.triggerGrouping("ligature");
                }
                else if (ncs.length > 1 && noClefOrCustos) {
                    Grouping.triggerGrouping("nc");
                }
                else if (ncs.length === 1 && noClefOrCustos) {
                    SelectOptions.triggerNcActions();
                }
                else {
                    console.log("Warning: no selection made");
                }
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
     * Select not neume elements.
     * @param {object[]} notNeumes - An array of not neumes elements.
     */
    function selectNn(notNeumes) {
        if (notNeumes.length > 0) {
            notNeumes.forEach(nn => {
                select(nn);
            });
            return false;
        } else {
            return true;
        }
    }
}

/**
 * Unselect all selected elements and run undo any extra
 * actions.
 */
export function unselect() {
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

/**
 * Generic select function.
 */
function select(el) {
    if (!$(el).hasClass("selected")) {
        $(el).attr("fill", "#d00");
        $(el).addClass("selected");
    }
}

/**
 * Select a syllable.
 * @param {SVGSVGElement} el - The nc element whose syllable to select.
 * @param {DragHandler} dragHandler - An instantiated DragHandler.
 */
function selectSyl(el, dragHandler) {
    if(!$(el).parent().hasClass("selected")){
        unselect();
        select($(el).parent());
        SelectOptions.triggerSylActions();
        dragHandler.dragInit();
    }
}

/**
 * Select a neume.
 * @param {SVGSVGElement} el - The nc element whose neume to select.
 * @param {DragHandler} dragHandler - An instantiated DragHandler.
 */
function selectNeumes(el, dragHandler) {
    if(!$(el).parent().hasClass("selected")){
        unselect();
        select($(el).parent());
        SelectOptions.triggerNeumeActions();
        dragHandler.dragInit();
    }
}

/**
 * Select an nc.
 * @param {SVGSVGElement} el - The nc element to select.
 * @param {DragHandler} dragHandler - An instantiated DragHandler.
 * @param {Array.SVGSVGElement} lastSelect - An array of the last selected elements.
 */
function selectNcs(el, dragHandler, lastSelect) {
    if(!$(el).hasClass("selected")){
        unselect();
        select(el);
        SelectOptions.triggerNcActions(lastSelect);
        dragHandler.dragInit();
    }
}

/**
 * Select a clef.
 * @param {SVGSVGElement} el - The clef element to select.
 * @param {DragHandler} dragHandler - An instantiated DragHandler.
 */
function selectClefs(el, dragHandler){
    if(!$(el).hasClass("selected")){
        unselect();
        select(el);
        SelectOptions.triggerClefActions();
        dragHandler.dragInit();
    }
}


