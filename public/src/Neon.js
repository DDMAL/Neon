function Neon (params) {

    //////////////
    // Constructor
    //////////////
    var vrvToolkit = new verovio.toolkit();
    var fileName = params.meifile;
    var dragHandler = new DragHandler(this, vrvToolkit);
    var navbarHandler = new Navbar(fileName);
    // var zoomHandler = new ZoomHandler(this);
    // var infoBox = new InfoBox(vrvToolkit);

    var vrvOptions = {
        // Width/Height needs to be set based on MEI information in the future
        breaks: "none",
        pageHeight: 400,
        pageWidth: 600,
        noFooter: 1,
        noHeader: 1
    };
    vrvToolkit.setOptions(vrvOptions);
    
    $.get("/uploads/mei/" + fileName, function(data) {
        loadData(data);
        loadPage();
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
        loadPage();
    }

    function loadPage () {
        var svg = vrvToolkit.renderToSVG(1);
        $("#svg_output").html(svg);
        d3.select("#svg_output").select("svg").attr("id", "svg_container");
        //infoBox.infoListeners();
    }

    function refreshPage () {
        loadPage();
        //zoomHandler.restoreTransformation();
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
                d3.select("body").call(
                    d3.drag()
                        .on("start", zoomHandler.startDrag)
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
    Neon.prototype.constructor = Neon;
    Neon.prototype.loadData = loadData;
    Neon.prototype.loadPage = loadPage;
    Neon.prototype.refreshPage = refreshPage;
    Neon.prototype.saveMEI = saveMEI;
}

