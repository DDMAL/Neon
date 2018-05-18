function Neon (params) {

    //////////////
    // Constructor
    //////////////
    var vrvToolkit = new verovio.toolkit();
    var fileName = params.meifile;
    var dragController = new DragController(this, vrvToolkit);
    var zoomController = new ZoomController(this);

    var vrvOptions = {
        noLayout: 1,
        noFooter: 1,
        noHeader: 1
    };
    vrvToolkit.setOptions(vrvOptions);
    
    $.get("/uploads/mei/" + fileName, function(data) {
        loadData(data);
        loadPage();
        dragController.dragInit();
        saveMEI();
    });

    // Set keypress listener
    d3.select("body").on("keydown", keydownListener);

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
    }

    function refreshPage () {
        var meiData = vrvToolkit.getMEI();
        loadData(meiData);
        zoomController.restoreTransformation();
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
            case "s":
                saveMEI();
                break;
            case "z":
                zoomController.zoom(1.25);
                break;
            case "Z":
                zoomController.zoom(0.80);
                break;
            case "k":
                zoomController.translate(0, unit);
                break;
            case "j":
                zoomController.translate(0, -unit);
                break;
            case "l":
                zoomController.translate(-unit, 0);
                break;
            case "h":
                zoomController.translate(unit, 0);
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

