import Neon from "./Neon.js";
import ZoomHandler from "./ZoomHandler.js";
import InfoBox from "./InfoBox.js";
import ViewControls from "./ViewControls.js";
import EditMode from "./EditMode.js";

const verovio = require("verovio-dev");

export default function NeonView (params) {
    var viewHeight = 750;
    var viewWidth = 800; 
    var meiFile = params.meifile;
    var bgimg = params.bgimg;
    var initialPage = true;
    var vrvToolkit = new verovio.toolkit();
    
    var neon = null;
    var zoomHandler = null;
    var infoBox = null;
    var viewControls = null;
    var editMode = null;

    $.get(meiFile, (data) => {
        neon = new Neon(data, vrvToolkit);
        zoomHandler = new ZoomHandler();
        infoBox = new InfoBox(neon);
        viewControls = new ViewControls(zoomHandler);
        editMode = new EditMode(this, meiFile, zoomHandler);
        loadView();
        // editMode.getScale();
        viewControls.setSylControls();
        viewControls.setHighlightControls();
    });

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
        viewControls.updateSylVisibility();
        viewControls.updateHighlight();
        resetListeners();
    }

    function refreshPage () {
        $("mei_output").html(neon.getSVG());
        initialPage = false;
        loadView();
        resetTransformations();
        editMode.resetListeners();
    }

    function saveMEI() {
        var pathSplit = meiFile.split('/');
        var i = pathSplit.length - 1;
        var fn = pathSplit[i];
        
        var meiData = neon.getMEI();
        $.ajax({
            type: "POST",
            url: "/save/" + fn,
            data: {"meiData": meiData,
                    "fileName": meiFile}
        }) 
    } 

    function loadSvg() {
        var svg = neon.getSVG();
        $("#mei_output").html(svg);
        $("#mei_output").children("svg").attr("id", "svg_container"); 
    }

    function resetListeners () {
        $("body").on("keydown keyup", (evt) => {
            if (evt.type === "keydown") {
                switch (evt.key) {
                    case "Shift":
                        d3.select("body").on(".drag", null);
                        d3.select("body").call(
                            d3.drag().on("start", zoomHandler.startDrag)
                                .on("drag", zoomHandler.dragging)
                        );
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
                        d3.select("body").on(".drag", null);
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
        viewControls.setOpacityFromSlider();
    }

    function rodanGetMei() {
        return neon.getMEI();
    }

    function edit(editorAction) {
        return neon.edit(editorAction);
    }

    NeonView.prototype.constructor = NeonView;
    NeonView.prototype.refreshPage = refreshPage;
    NeonView.prototype.resetListeners = resetListeners;
    NeonView.prototype.rodanGetMei = rodanGetMei;
    NeonView.prototype.edit = edit;
}
