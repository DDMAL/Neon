import { Controls } from './Controls.js';
import { InfoBox } from './InfoBox.js';
import { ZoomHandler } from './ZoomHandler.js';
import { verovio } from './verovio-toolkit.js';
import { EditMode } from './EditMode.js';

function Neon (params) {
    
    //////////////
    // Constructor
    //////////////

    var viewHeight = 800;   // size of the view box on the page
    var viewWidth = 600;

    var mei = params.meifile;
    var bgimg = params.bgimg;
    var vrvToolkit = new verovio.toolkit();
    var zoomhandler = new ZoomHandler(this);
    var infobox = new InfoBox(vrvToolkit);
    var controls = new Controls(this, zoomhandler);
    var editMode = new EditMode(this);

    var vrvOptions = {
        noFooter: 1,
        noHeader: 1,
        pageMarginLeft: 0,
        pageMarginTop: 0,
    };
    vrvToolkit.setOptions(vrvOptions);
    $.get(mei, function(data) {
        loadData(data);
    });

    // Set keypress listener
    d3.select("body")
        .on("keydown", keydownListener)
        .on("keyup", () => {
            if (d3.event.key == "Shift") {
                d3.select("body").on(".drag", null);
            }
        });

    ////////////
    // Functions
    ////////////

    // Loads data into toolkit and also loads the image & mei svg data
    function loadData (data) {
        vrvToolkit.loadData(data);
        loadView();
    }

    function loadView () {
        var view_layer = d3.select("#svg_output").append("svg");
        var bg_img = view_layer.append("image");
        view_layer.append('g').attr("id", "mei_output");

        var svg = vrvToolkit.renderToSVG(1);
        $("#mei_output").html(svg);
        d3.select("#mei_output").select("svg").attr("id", "svg_container");
        if (controls.shouldHideText()) {
            d3.select("#mei_output").selectAll(".syl").style("visibility", "hidden");
        }
        
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
        
        infobox.infoListeners();
    }

    function refreshPage () {
        $("#mei_output").html(vrvToolkit.renderToSVG(1));
        if (controls.shouldHideText()) {
            d3.select("#mei_output").selectAll(".syl").style("visibility", "hidden");
        }
        infobox.infoListeners();
        controls.setOpacityFromSlider();
        zoomhandler.restoreTransformation();
    }

    

    // function saveMEI() {
    //     var meiData = vrvToolkit.getMEI();
    //     $.ajax({
    //         type: "POST",
    //         url: "/save/" + fileName,
    //         data: {"meiData": meiData,
    //                 "fileName": fileName}
    //     }) 
    // }
   

    function getMEI () {
        return vrvToolkit.getMEI();
    }

    function keydownListener () {
        var unit = 10;
        switch (d3.event.key) {
            case "Shift":
                d3.select("body").call(
                    d3.drag()
                        .on("start", zoomhandler.startDrag)
                        .on("drag", zoomhandler.dragging)
                );
                break;
            // case "s":
            //     saveMEI();
            //     break;
            case "z":
                zoomhandler.zoom(1.25);
                $("#zoomOutput").html(Math.round($("#zoomOutput").val() *  1.25));
                break;
            case "Z":
                zoomhandler.zoom(0.80);
                $("#zoomOutput").html(Math.round($("#zoomOutput").val() * 0.80));
                break;
            default: break;
        }
    }
    
    // Constructor reference
    Neon.prototype.constructor = Neon;
    Neon.prototype.loadView = loadView;
    Neon.prototype.refreshPage = refreshPage;
    Neon.prototype.getMEI = getMEI;
}

export { Neon };
