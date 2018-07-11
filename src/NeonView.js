import Neon from "./Neon.js";
import ZoomHandler from "./ZoomHandler.js";
import InfoBox from "./InfoBox.js";
import Controls from "./Controls.js";

const verovio = require("verovio-dev");

export default function NeonView (params) {
    var viewHeight = 800;
    var viewWidth = 600;
    var meiFile = params.meifile;
    var bgimg = params.bgimg;
    var vrvToolkit = new verovio.toolkit();
    
    var neon = null;
    var zoomHandler = null;
    var infoBox = null;
    var controls = null;

    $.get(meiFile, (data) => {
        neon = new Neon(data, vrvToolkit);
        zoomHandler = new ZoomHandler();
        infoBox = new InfoBox(neon);
        controls = new Controls(zoomHandler);
        loadView();
        controls.setSylControls();
        controls.setHighlightControls();
    });

    function loadView () {
        var view_layer = d3.select("#svg_output").append("svg");
        var bg_img = view_layer.append("image");
        view_layer.append("g").attr("id", "mei_output");

        var svg = neon.getSVG();
        $("#mei_output").html(svg);
        d3.select("#mei_output").select("svg").attr("id", "svg_container");

        var height = parseInt(d3.select("#svg_container").attr("height"));
        var width = parseInt(d3.select("#svg_container").attr("width"));
        bg_img.attr("id", "bgimg")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", height)
            .attr("width", width)
            .attr("xlink:href", bgimg);
       
        view_layer.attr("id", "svg_group")
            .attr("width", viewWidth)
            .attr("height", viewHeight)
            .attr("viewBox", "0 0 " + width + " " + height);
        controls.updateHighlight();
        controls.updateSylVisibility();
        resetListeners();
    }

    function refreshPage () {
        $("mei_output").html(neon.getSVG());
        resetListeners();
        resetTransformations();
    }

    function resetListeners () {
        d3.select("body")
            .on("keydown", () => {
                if (d3.event.key == "Shift") {
                    d3.select("body").call(
                        d3.drag()
                            .on("start", zoomHandler.startDrag)
                            .on("drag", zoomHandler.dragging)
                    );
                }
            })
            .on("keyup", () => {
                if (d3.event.key == "Shift") {
                    d3.select("body").on(".drag", null);
                }
            });
        infoBox.infoListeners();
    }

    function resetTransformations () {
        zoomHandler.restoreTransformation();
        controls.setOpacityFromSlider();
    }

    function rodanGetMei() {
        return neon.getMEI();
    }

    NeonView.prototype.constructor = NeonView;
    NeonView.prototype.refreshPage = refreshPage;
    NeonView.prototype.rodanGetMei = rodanGetMei;
}
