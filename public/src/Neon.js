function Neon (params) {
    //////////////
    // Constructor
    //////////////

    // Width/Height needs to be set based on MEI information in the future
    var pageWidth = 1000;
    var pageHeight = 1400;

    var vrvToolkit = new verovio.toolkit();
    var fileName = params.meifile;
    var bgimg = fileName.split('.', 2)[0] + ".png";
    var currentElement = "punctum";
    var initialPage = true;

    var dragHandler = new DragHandler(this, vrvToolkit);
    var navbarHandler = new Navbar(fileName);
    var zoomHandler = new ZoomHandler(this);
    var viewControls = new ViewControls(this, zoomHandler, dragHandler);
    var editControls = new EditControls();
    var insertControls = new InsertControls(this);
    console.log(insertControls);
    var infoBox = new InfoBox(vrvToolkit);

    var vrvOptions = {
        // Width/Height needs to be set based on MEI information in the future
        pageHeight: pageHeight,
        pageWidth: pageWidth,
        noFooter: 1,
        noHeader: 1,
        //scale: 50
    };
    vrvToolkit.setOptions(vrvOptions);
    
    $.get("/uploads/mei/" + fileName, function(data) {
        loadData(data);
        dragHandler.dragInit();
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
    function loadData (data) {
        vrvToolkit.loadData(data);
        vrvToolkit.loadData(data);
        loadImage();
        loadPage();
    }

    function loadImage () {
        if (initialPage) {
            var bgimg_layer = d3.select("#svg_output").append("svg")
            .attr("id", "svg_group")
            .attr("width", pageWidth)
            .attr("height", pageHeight)
            .attr("viewBox", '0 0 ' + pageWidth + " " + pageHeight);

            var bg = bgimg_layer.append("image")
                .attr("id", "bgimg")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", pageHeight)
                .attr("width", pageWidth)
                .attr("xlink:href", "/uploads/png/" + bgimg);

            bgimg_layer.append('g')
                .attr("id", "mei_output");
        }
    }

    function loadPage () {
        var svg = vrvToolkit.renderToSVG(1);
        $("#mei_output").html(svg);
        d3.select("#mei_output").select("svg").attr("id", "svg_container");
        if (viewControls.shouldHideText()) {
            d3.select("#mei_output").selectAll(".syl").style("visibility", "hidden");
        }
        infoBox.infoListeners();
    }

    function refreshPage () {
        var meiData = vrvToolkit.getMEI();
        initialPage = false;
        loadData(meiData);
        zoomHandler.restoreTransformation();
    }

    function saveMEI() {
        var meiData = vrvToolkit.getMEI();
        $.ajax({
            type: "POST",
            url: "/save/" + fileName,
            data: {"meiData": meiData,
                    "fileName": fileName}
        }) 
    }

    function keydownListener () {
        var unit = 10;
        switch (d3.event.key) {
            case "Shift":
                insertControls.resetCursor();
                d3.select("body").call(
                    d3.drag()
                        .on("start", zoomHandler.startDrag,)
                        .on("drag", zoomHandler.dragging)
                );
                break;
            case "s":
                saveMEI();
                break;
            case "z":
                zoomHandler.zoom(1.25);
                break;
            case "Z":
                zoomHandler.zoom(0.80);
                break;
            default: break;
        }
    }
    // Constructor reference
    Neon.prototype.pageWidth = pageWidth;
    Neon.prototype.pageHeight = pageHeight;

    Neon.prototype.constructor = Neon;
    Neon.prototype.loadData = loadData;
    Neon.prototype.loadPage = loadPage;
    Neon.prototype.refreshPage = refreshPage;
    Neon.prototype.saveMEI = saveMEI;
}

