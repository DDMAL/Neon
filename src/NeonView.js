import Neon from "./Neon.js";
import ZoomHandler from "./Zoom.js";
import InfoBox from "./InfoBox.js";
import * as Controls from "./Controls.js";
import * as Cursor from "./Cursor.js";
import EditMode from "./EditMode.js";
import * as Compatibility from "./Compatibility.js";

const verovio = require("verovio-dev");

/**
 * The class managing DOM objects and the Neon class for the application.
 * @constructor
 * @param {object} params - An object containing the filenames of the MEI file and background image.
 * @param {string} params.meifile - The filename of the MEI file.
 * @param {string} params.bgimg - The filename of the background image.
 * @param {string} params.mode - The mode to run Neon in (standalone or rodan).
 */
function NeonView (params) {
    var viewHeight = 850;
    var viewWidth = 800;
    var meiFile = params.meifile;
    var bgimg = params.bgimg;
    var initialPage = true;
    var vrvToolkit = new verovio.toolkit();

    var neon = null;
    var zoomHandler = null;
    var infoBox = null;
    var editMode = null;
    let neonview = this;
    if (params.mode === "rodan") {
        Compatibility.setMode(Compatibility.modes.rodan);
    } else {
        Compatibility.setMode(Compatibility.modes.standalone);
    }
    if (params.raw === "true") {
        init(meiFile);
    } else {
        $.get(meiFile, init);
    }

    function init(data) {
        neon = new Neon(data, vrvToolkit);
        zoomHandler = new ZoomHandler();
        infoBox = new InfoBox(neon);
        Controls.initDisplayControls(zoomHandler);
        editMode = new EditMode(neonview, neon, meiFile, zoomHandler);
        loadView();
        // editMode.getScale();
        Controls.setSylControls();
    }

    /**
     * Load the view, including background image and rendered MEI.
     */
    function loadView () {
        if (initialPage){
            var group = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            group.id = "svg_group";
            var bg = document.createElementNS("http://www.w3.org/2000/svg", "image");
            bg.id = "bgimg";
            bg.setAttributeNS("http://www.w3.org/1999/xlink", "href", bgimg);
            var mei = document.createElementNS("http://www.w3.org/2000/svg", "g");
            mei.id = "mei_output";
            group.append(bg);
            group.append(mei);
            $("#svg_output").append(group);
            loadSvg();

            var height = parseInt($("#svg_container").attr("height"));
            var width = parseInt($("#svg_container").attr("width"));
            $("#bgimg").attr("x", 0)
                .attr("y", 0)
                .attr("height", height)
                .attr("width", width);

            $("#svg_group").attr("width", "100%")
                .attr("height", viewHeight)
                .attr("viewBox", "0 0 " + width + " " + height);
        }
        else {
            loadSvg();
        }
        Controls.updateSylVisibility();
        Controls.updateHighlight();
        resetListeners();
    }

    /**
     * Refresh the page, often after an editor action.
     */
    function refreshPage () {
        $("mei_output").html(neon.getSVG());
        initialPage = false;
        loadView();
        resetTransformations();
        editMode.resetListeners();
    }

    /**
     * Save the MEI to a file.
     */
    function saveMEI() {
        Compatibility.saveFile(meiFile, neon.getMEI());
    }

    /**
     * Load the SVG and put it in the SVG container.
     */
    function loadSvg() {
        var svg = neon.getSVG();
        $("#mei_output").html(svg);
        $("#mei_output").children("svg").attr("id", "svg_container");
    }

    /**
     * Reset hotkey and panning listeners
     */
    function resetListeners () {
        $("body").on("keydown keyup", (evt) => {
            if (evt.type === "keydown") {
                switch (evt.key) {
                    case "Shift":
                        d3.select("#svg_output").on(".drag", null);
                        d3.select("#svg_output").call(
                            d3.drag().on("start", zoomHandler.startDrag)
                                .on("drag", zoomHandler.dragging)
                        );
                        Cursor.updateCursorTo("grab");
                        break;
                    case "s":
                        saveMEI();
                        break;
                    case "h":
                        $("#mei_output").css("visibility", "hidden");
                        break;
                    default: break;
                }
            }
            else {
                switch (evt.key) {
                    case "Shift":
                        d3.select("#svg_output").on(".drag", null);
                        Cursor.updateCursorTo("");
                        if (editMode.isInsertMode()) {
                            Cursor.updateCursor();
                        }
                        break;
                    case "h":
                        $("#mei_output").css("visibility", "visible");
                        break;
                    default: break;
                }
            }
        });
        infoBox.infoListeners();
    }

    function resetTransformations () {
        zoomHandler.restoreTransformation();
        Controls.setOpacityFromSlider();
    }

    /**
     * Get the MEI for use in Rodan.
     */
    function rodanGetMei() {
        return neon.getMEI();
    }

    /**
     * Execute an editor action.
     * @param {object} editorAction - The editor action.
     * @param {boolean} addToUndo - Whether or not to add the action to the undo stack.
     * @returns {boolean} If the action succeeded.
     */
    function edit(editorAction, addToUndo = true) {
        var val =  neon.edit(editorAction, addToUndo);
        if (val) {
            Compatibility.autosave(meiFile, neon.getMEI());
        }
        return val;
    }

    /**
     * Undo the last action.
     * @returns {boolean}
     */
    function undo() {
        return neon.undo();
    }

    /**
     * Redo the last undone action.
     * @returns {boolean}
     */
    function redo() {
        return neon.redo();
    }

    function addStateToUndo() {
        neon.addStateToUndo();
    }

    NeonView.prototype.constructor = NeonView;
    NeonView.prototype.refreshPage = refreshPage;
    NeonView.prototype.resetListeners = resetListeners;
    NeonView.prototype.rodanGetMei = rodanGetMei;
    NeonView.prototype.edit = edit;
    NeonView.prototype.saveMEI = saveMEI;
    NeonView.prototype.undo = undo;
    NeonView.prototype.redo = redo;
    NeonView.prototype.addStateToUndo = addStateToUndo;
}

export {NeonView as default};
