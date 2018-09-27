/** @module Select */

import * as Color from "./Color.js";
import * as Contents from "./Contents.js";
import * as Controls from "./Controls.js";
import * as Grouping from "./Grouping.js";
import * as SelectOptions from "./SelectOptions.js";
import Resize from "./ResizeStaff.js";

/**
 * Handle click selection and mark elements as selected.
 * @constructor
 * @param {DragHandler} dragHandler - An instantiated DragHandler object.
 * @param {module:Zoom~Zoomhandler} zoomHandler
 * @param {NeonView} neonView - The NeonView parent.
 * @param {module:Neon~Neon} neon
 * @param {InfoBox} infoBox
 */
export function ClickSelect (dragHandler, zoomHandler, neonView, neon, infoBox) {
    selectListeners();

    //Selection mode toggle
    function selectListeners () {
        var classesToSelect = "use, #svg_group";
        Controls.initSelectionButtons();

        //Activating selected neumes
        $(classesToSelect).off("mousedown", handler);
        $(classesToSelect).on("mousedown", handler);

        function handler (evt) {
            var editing = false;
            var insertEls = Array.from(d3.selectAll(".insertel")._groups[0]);
            insertEls.forEach(el => {
                if ($(el).hasClass("is-active")){
                    editing = true;
                }
            })
            if (editing || evt.shiftKey) { return; }
            if (this.tagName === "use") {
                // If this was part of a drag select, drag don't reselect the one component
                if ($(this).parents(".selected").length === 0) {
                    selectAll([this], neon, neonView, dragHandler, infoBox);
                }
            }
            else {
                if (!$("#selByStaff").hasClass("is-active")) {
                    infoBox.infoListeners();
                    return;
                }
                // Check if point is in staff.
                var container = document.getElementsByClassName("definition-scale")[0];
                let pt = container.createSVGPoint();
                pt.x = evt.clientX;
                pt.y = evt.clientY;
                let transformMatrix = container.getScreenCTM();
                pt = pt.matrixTransform(transformMatrix.inverse());

                let selectedStaves = Array.from($(".staff")).filter((staff) => {
                    let box = getStaffBBox(staff);
                    return (box.ulx < pt.x && pt.x < box.lrx) && (box.uly < pt.y && pt.y < box.lry);
                });
                if (selectedStaves.length != 1) {
                    if ($(".selected").length > 0) {
                        infoBox.infoListeners();
                    }
                    unselect();
                    return;
                }

                var staff = selectedStaves[0];
                if (!$(staff).hasClass("selected")) {
                    selectStaff(staff, dragHandler);
                    SelectOptions.triggerSplitActions();
                    let resize = new Resize(staff.id, neonView, dragHandler);
                    resize.drawInitialRect();
                }
            }
        }

        // click away listeners
        $("body").on("keydown", (evt) => { // click
            if (evt.type === "keydown" && evt.key !== "Escape") return;
            SelectOptions.endOptionsSelection();
            if ($(".selected").length > 0) {
                infoBox.infoListeners();
            }
            unselect();
        })

        $("use").on("click", function(e){
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
 * @param {module:Neon~Neon} neon
 * @param {InfoBox} infoBox
 */
export function DragSelect (dragHandler, zoomHandler, neonView, neon, infoBox) {
    var initialX = 0,
        initialY = 0,
        panning = false,
        dragSelecting = false;

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
    function selStart () {
        var editing = false;
        var insertEls = Array.from(d3.selectAll(".insertel")._groups[0]);
        insertEls.forEach(el => {
            if ($(el).hasClass("is-active")){
                editing = true;
            }
        })
        if (d3.event.sourceEvent.target.nodeName != "use" && !editing){
            if (!d3.event.sourceEvent.shiftKey){
                if (!$("#selByStaff").hasClass("is-active") || pointNotInStaff(d3.mouse(this))) {
                    unselect();
                    dragSelecting = true;
                    var initialP = d3.mouse(this);
                    initialX = initialP[0];
                    initialY = initialP[1];
                    initRect(initialX, initialY);
                }
            }
            else {
                panning = true;
                zoomHandler.startDrag();
            }
        }
        else if (d3.event.sourceEvent.shiftKey) {
            panning = true;
            zoomHandler.startDrag();
        }
        editing = false;
    }

    /**
     * Check if a point is within the bounding boxes of any staves.
     * @param {number[]} point - An array where index 0 corresponds to x and 1 corresponds to y
     * @returns {boolean}
     */
    function pointNotInStaff (point) {
        let staves = Array.from($(".staff"));
        let filtered = staves.filter((staff) => {
            let box = getStaffBBox(staff);
            return (box.ulx < point[0] && point[0] < box.lrx) && (box.uly < point[1] && point[1] < box.lry);
        });
        return (filtered.length == 0);
    }

    /**
     * Action to run while the drag select continues. Updates the rectangle.
     */
    function selecting () {
        if (!panning && dragSelecting){
            var currentPt = d3.mouse(this);
            var curX = currentPt[0];
            var curY = currentPt[1];

            var newX = curX<initialX?curX:initialX;
            var newY = curY<initialY?curY:initialY;
            var width = curX<initialX?initialX-curX:curX-initialX;
            var height = curY<initialY?initialY-curY:curY-initialY;

            updateRect(newX, newY, width, height);
        }
        else if (panning){
            zoomHandler.dragging();
        }
    }

    /**
     * Finish the selection and mark elements within the rectangle as being selected.
     */
    function selEnd () {
        if (!panning && dragSelecting){
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
                if (d.tagName === "use") {
                    let box = d.parentNode.getBBox();
                    let ulx = box.x;
                    let uly = box.y;
                    let lrx = box.x + box.width;
                    let lry = box.y + box.height;
                    return !(((rx < ulx && lx < ulx) || (rx > lrx && lx > lrx)) || ((ry < uly && ly < uly) || (ry > lry && ly > lry)));
                } else {
                    let box = getStaffBBox(d);
                    return !(((rx < box.ulx && lx < box.ulx) || (rx > box.lrx && lx > box.lrx)) || ((ry < box.uly && ly < box.uly) || (ry > box.lry && ly > box.lry)));
                }
            });

            selectAll(elements, neon, neonView, dragHandler, infoBox);

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
    function initRect (ulx, uly) {
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
    function updateRect (newX, newY, currentWidth, currentHeight) {
        d3.select("#selectRect")
            .attr("x", newX)
            .attr("y", newY)
            .attr("width", currentWidth)
            .attr("height", currentHeight)
    }
}

/**
 * Get the bounding box of a staff based on its staff lines.
 * @param {SVGSVGElement} staff
 * @returns {object}
 */
function getStaffBBox (staff) {
    let ulx, uly, lrx, lry;
    Array.from($(staff).children("path")).forEach(path => {
        let box = path.getBBox();
        if (uly === undefined || box.y < uly) {
            uly = box.y;
        }
        if (ulx === undefined || box.x < ulx) {
            ulx = box.x;
        }
        if (lry === undefined || box.y + box.height > lry) {
            lry = box.y + box.height;
        }
        if (lrx === undefined || box.x + box.width > lrx) {
            lrx = box.x + box.width;
        }
    });
    return {"ulx": ulx, "uly": uly, "lrx": lrx, "lry": lry};
}

/**
 * Select not neume elements.
 * @param {object[]} notNeumes - An array of not neumes elements.
 */
function selectNn (notNeumes) {
    if (notNeumes.length > 0) {
        notNeumes.forEach(nn => { select(nn); });
        return false;
    } else {
        return true;
    }
}

/**
 * Handle selecting an array of elements based on the selection type.
 * @param {SVGSVGElement[]} elements - The elements to select. Either <g> or <use>.
 * @param {module:Neon~Neon} neon - A neon instance.
 * @param {NeonView} neonView - The NeonView parent.
 * @param {DragHandler} dragHandler - A DragHandler to alow staff resizing and some neume component selection cases.
 * @param {InfoBox} infoBox
 */
function selectAll (elements, neon, neonView, dragHandler, infoBox) {
    var syls = [],
        neumes = [],
        ncs = [],
        notNeumes = [];

    elements.forEach(el => {
        var firstParent = el.parentNode;

        if ($(firstParent).hasClass("nc")) {
            ncs.push(firstParent);

            let neume = firstParent.parentNode;
            if (!neumes.includes(neume)) {
                neumes.push(neume);
            }

            var syl = neume.parentNode;
            if (!syls.includes(syl)) {
                syls.push(syl);
            }
        }
        else {
            notNeumes.push(firstParent);
        }
    });

    // Determine selection mode
    var selectMode = null;
    Array.from($(".sel-by")).forEach(tab => {
        if ($(tab).hasClass("is-active")) {
            selectMode = $(tab)[0].id;
        }
    });

    if (selectMode == "selByStaff") {
        let toSelect = [];
        elements.forEach(el => {
            if (el.tagName === "use") {
                let staff = $(el).parents(".staff")[0];
                if (!toSelect.includes(staff)) {
                    toSelect.push(staff);
                }
            } else {
                if (!toSelect.includes(el)) {
                    toSelect.push(el);
                }
            }
        });
        toSelect.forEach(elem => {
            $(elem).addClass("selected");
        });

        Controls.updateHighlight();
        toSelect.forEach(elem => {
            Color.highlight(elem, "#d00");
        });
        if (toSelect.length == 1) {
            SelectOptions.triggerSplitActions();
            let resize = new Resize(toSelect[0].id, neonView, dragHandler);
            resize.drawInitialRect();
        }
        else if (toSelect.length == 2) {
            let bb1 = getStaffBBox(toSelect[0]);
            let bb2 = getStaffBBox(toSelect[1]);
            var avgHeight = (bb1.lry - bb1.uly + bb2.lry - bb2.uly) / 2;
            if (Math.abs(bb1.uly - bb2.uly) < avgHeight) {
                SelectOptions.triggerStaffActions();
            }
        }
    }
    else if (selectMode === "selBySyl") {
        let noClefOrCustos = selectNn(notNeumes);
        syls.forEach(s => { select(s); });
        if (!noClefOrCustos) {
            if (notNeumes.length == 1 && ncs.length == 0){
                let el = notNeumes[0];
                // if ($(el).hasClass("custos")){
                //     SelectOptions.triggerNcActions([el]);
                // }
                if ($(el).hasClass("clef")) {
                    SelectOptions.triggerClefActions([el]);
                }
            }
        }
        else if (syls.length > 1) {
            Grouping.triggerGrouping("syl");
        }
        else if (syls.length == 1) {
            var syl = syls[0];
            var nmChildren = $(syl).children(".neume");
            if (nmChildren.length == 1) {
                let neume = nmChildren[0];
                let ncChildren = neume.children;
                if (ncChildren.length == 1) {
                    unselect();
                    select(ncChildren[0]);
                    SelectOptions.triggerNcActions(ncChildren[0]);
                }
                else if (ncChildren.length == 2) {
                    unselect();
                    if (isLigature(ncChildren[0], neon)) {
                        selectNcs(ncChildren[0], dragHandler, neon);
                        Grouping.triggerGrouping("ligature");
                    }
                    else {
                        select(neume);
                        SelectOptions.triggerNeumeActions();
                    }
                }
                else {
                    unselect();
                    select(neume);
                    SelectOptions.triggerNeumeActions();
                }
            }
            else {
                SelectOptions.triggerSylActions();
            }
        }
    }
    else if (selectMode === "selByNeume") {
        unselect();
        let noClefOrCustos = selectNn(notNeumes);
        neumes.forEach(n => { select(n); });
        if (!noClefOrCustos) {
            if (notNeumes.length == 1 && ncs.length == 0) {
                let el = notNeumes[0];
                // if ($(el).hasClass("custos")){
                //     SelectOptions.triggerNcActions([el]);
                // }
                if ($(el).hasClass("clef")) {
                    SelectOptions.triggerClefActions([el]);
                }
            }
        }
        else if (neumes.length > 1) {
            let syllable = neumes[0].parentElement;
            let group = false;
            for (var i = 1; i < neumes.length; i++) {
                if (syllable !== neumes[i].parentElement) {
                    group = true;
                    break;
                }
            }
            if (group) {
                Grouping.triggerGrouping("neume");
            }
            else {
                let sylNeumes = Array.from(syllable.children).filter(child => $(child).hasClass("neume"));
                let result = true;
                sylNeumes.forEach(neume => { result = result && neumes.includes(neume); });
                if (result) {
                    unselect();
                    select(syllable);
                    SelectOptions.triggerSylActions();
                }
            }
        }
        else if (neumes.length == 1) {
            let neume = neumes[0];
            let ncChildren = neume.children;
            if (ncChildren.length == 1) {
                unselect();
                select(ncChildren[0]);
                SelectOptions.triggerNcActions(ncChildren[0]);
            }
            else if (ncChildren.length == 2 && isLigature(ncChildren[0], neon)) {
                unselect();
                select(ncChildren[0]);
                select(ncChildren[1]);
                Grouping.triggerGrouping("ligature");
            }
            else {
                SelectOptions.triggerNeumeActions();
            }
        }
    }
    else if (selectMode === "selByNc") {
        let noClefOrCustos = selectNn(notNeumes);
        if (ncs.length == 1 && noClefOrCustos) {
            selectNcs(ncs[0].children[0], dragHandler, neon);
            return;
        }
        var prev = $(ncs[0]).prev();
        if (ncs.length != 0 && isLigature(ncs[0], neon) && prev.length != 0 && isLigature($(ncs[0]).prev()[0], neon)) {
            ncs.push($(ncs[0]).prev()[0]);
        }
        ncs.forEach(nc => { select(ncs); });
        if (!noClefOrCustos) {
            if (notNeumes.length == 1 && ncs.length == 0) {
                var el = notNeumes[0];
                // if ($(el).hasClass("custos")){
                //     SelectOptions.triggerNcActions([el]);
                // }
                if ($(el).hasClass("clef")) {
                    SelectOptions.triggerClefActions([el]);
                }
            }
        }
        else if (ncs.length == 2) {
            let firstChild = ncs[0].children[0];
            let secondChild = ncs[1].children[0];
            var firstX = firstChild.x.baseVal.value;    //$(ncs[0]).children()[0].x.baseVal.value;
            var secondX = secondChild.x.baseVal.value;   //$(ncs[1]).children()[0].x.baseVal.value;
            var firstY = 0;
            var secondY = 0;

            if (firstX == secondX) {
                firstY = secondChild.y.baseVal.value;
                secondY = firstChild.y.baseVal.value;
            }
            else {
                firstY = firstChild.y.baseVal.value;
                secondY = secondChild.y.baseVal.value;
            }

            if (secondY > firstY) {
                if (ncs[0].parentNode.id === ncs[1].parentNode.id) {
                    let isFirstLigature = isLigature(ncs[0], neon);
                    let isSecondLigature = isLigature(ncs[1], neon);
                    if ((isFirstLigature && isSecondLigature) || (!isFirstLigature && !isSecondLigature)) {
                        Grouping.triggerGrouping("ligature");
                    }
                   /*else{
                        Grouping.triggerGrouping("ligatureNc");
                    }*/
                }
                else {
                    if (ncs[0].parentElement != ncs[1].parentElement) {
                        Grouping.triggerGrouping("nc");
                    }
                }
            }
            else {
                if (ncs[0].parentElement != ncs[1].parentElement) {
                    Grouping.triggerGrouping("nc");
                }
            }
        }
        else if (ncs.length > 1 && noClefOrCustos) {
            let neume = ncs[0].parentElement;
            let group = false;
            for (var i = 1; i < ncs.length; i++) {
                if (ncs[i].parentElement !== neume) {
                    group = true;
                    break;
                }
            }
            if (group) {
                Grouping.triggerGrouping("nc");
            } else {
                let neumeNcs = Array.from(neume.children).filter(nc => $(nc).hasClass("nc"));
                let result = true;
                neumeNcs.forEach(nc => { result = result && ncs.includes(nc); });
                if (result) {
                    unselect();
                    select(neume);
                    SelectOptions.triggerNeumeActions();
                }
            }
        }
        else if (ncs.length === 1) {
            SelectOptions.triggerNcActions(ncs[0]);
        }
    }
    if ($(".selected").length > 0) {
        infoBox.stopListeners();
    }
    dragHandler.dragInit();
}

/**
 * Unselect all selected elements and run undo any extra
 * actions.
 */
export function unselect () {
    var selected = $(".selected");
    for (var i=0; i < selected.length; i++) {
        if ($(selected[i]).hasClass("staff")) {
            $(selected[i]).removeClass("selected");
            Color.unhighlight(selected[i]);
        } else {
            $(selected[i]).removeClass("selected").attr("fill", null);
        }
    }
    $(".syl-select").css("color", "");
    $(".syl-select").css("font-weight", "");
    $(".syl-select").removeClass("syl-select");

    d3.select("#resizeRect").remove();

    if (!$("#selByStaff").hasClass("is-active")) {
        Grouping.endGroupingSelection();
    }
    else {
        SelectOptions.endOptionsSelection();
    }
    Controls.updateHighlight();
}

/**
 * Generic select function.
 * @param {SVGSVGElement} el
 */
function select (el) {
    if (!$(el).hasClass("selected")) {
        $(el).attr("fill", "#d00");
        $(el).addClass("selected");

        var sylId;
        if ($(el).hasClass("syllable")) {
            sylId = el.id;
        } else if ($(el).parents(".syllable").length) {
            sylId = $(el).parents(".syllable").attr("id");
        }
        if (sylId !== undefined) {
            if ($("span").filter("." + sylId).length) {
                $("span").filter("." + sylId).css("color", "#d00");
                $("span").filter("." + sylId).css("font-weight", "bold");
                $("span").filter("." + sylId).addClass("syl-select");
            }
        }
    }
    Controls.updateHighlight();
}

/**
 * Select an nc.
 * @param {SVGSVGElement} el - The nc element to select.
 * @param {DragHandler} dragHandler - An instantiated DragHandler.
 */
function selectNcs (el, dragHandler, neon) {
    if (!$(el).parent().hasClass("selected")){
        var parent = el.parentNode;
        unselect();
        select(parent);
        if (isLigature(parent, neon)){
            var prevNc = $(parent).prev()[0];
            if (isLigature(prevNc, neon)){
                select(prevNc);
            }
            else{
                var nextNc = $(parent).next()[0];
                if (isLigature(nextNc, neon)){
                    select(nextNc);
                }
                else{
                    console.warn("Error: Neither prev or next nc are ligatures");
                }
            }
            Grouping.triggerGrouping("ligature");
        }
        else if ($(parent).hasClass("nc")){
            SelectOptions.triggerNcActions(parent);
        }
        else{
            console.warn("No action triggered!");
        }
        dragHandler.dragInit();
    }
}

/**
 * Select a staff.
 * @param {SVGSVGElement} el - The staff element to select.
 * @param {DragHandler} dragHandler - An instantiated DragHandler.
 */
export function selectStaff (el, dragHandler){
    let staff = $(el);
    if (!staff.hasClass("selected")) {
        unselect();
        staff.addClass("selected");
        Controls.updateHighlight();
        Color.highlight(el, "#d00");
        dragHandler.dragInit();
    }
}

/**
 * Check if neume component is part of a ligature
 * @param {SVGSVGElement} nc - The neume component to check.
 * @param {module:Neon~Neon} neon - An instantiated Neon.
 */
function isLigature (nc, neon) {
    var attributes = neon.getElementAttr(nc.id);
    if (attributes.ligature == "true") return true;
    return false;
}


