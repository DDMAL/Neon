import Neon from "./Neon.js";
import ZoomHandler from "./ZoomHandler.js";
import InfoBox from "./InfoBox.js";
import ViewControls from "./ViewControls.js";
import EditMode from "./EditMode.js";
import { verovio } from "./verovio-toolkit.js";

export default function NeonView (params) {
    var viewHeight = 800;
    var viewWidth = 600;
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
        zoomHandler = new ZoomHandler(this);
        infoBox = new InfoBox(neon);
        viewControls = new ViewControls(zoomHandler);
        editMode = new EditMode(this, meiFile);
        viewControls.setSylControls(this);
        loadView();
    });

    function loadView () {
        if (initialPage){
            var view_layer = d3.select("#svg_output").append("svg");
            var bg_img = view_layer.append("image");
            view_layer.append("g").attr("id", "mei_output");
            loadSvg(); 

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
        }
        else {
            loadSvg(); 
        }
        setSvgText();
        resetListeners();
    }

    function refreshPage () {
        $("mei_output").html(neon.getSVG());
        initialPage = false;
        loadView();
        resetTransformations();
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

    function setSvgText () {
        if (viewControls.shouldHideText()) {
            d3.select("#mei_output").selectAll(".syl").style("visibility", "hidden");
        } else {
            d3.select("#mei_output").selectAll(".syl").style("visibility", "visible");
        }
    }

    function loadSvg() {
        var svg = neon.getSVG();
        $("#mei_output").html(svg);
        d3.select("#mei_output").select("svg").attr("id", "svg_container"); 
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
                else if (d3.event.key == "s") {
                    saveMEI();
                }
                else if (d3.event.key == "h") {
                    d3.select("#mei_output").attr("visibility", "hidden");
                }
            })
            .on("keyup", () => {
                if (d3.event.key == "Shift") {
                    d3.select("body").on(".drag", null);
                }
                if (d3.event.key == "h") {
                    d3.select("#mei_output").attr("visibility", "visible");
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

    function rodanGetMei() {
        return neon.getMEI();
    }

    function edit(editorAction) {
        return neon.edit(editorAction);
    }

    NeonView.prototype.constructor = NeonView;
    NeonView.prototype.refreshPage = refreshPage;
    NeonView.prototype.rodanGetMei = rodanGetMei;
    NeonView.prototype.edit = edit;
}
