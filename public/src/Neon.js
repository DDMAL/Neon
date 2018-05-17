function Neon (params) {

    //////////////
    // Constructor
    //////////////
    var vrvToolkit = new verovio.toolkit();
    var fileName = params.meifile;
    var dragController = new DragController(this, vrvToolkit);
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
    }

    function refreshPage () {
        var meiData = vrvToolkit.getMEI();
        loadData(meiData);
    }

    function saveMEI() {
        $(window).keydown(function(event) {
            if (event.keyCode == 83) {
                var meiData = vrvToolkit.getMEI();
                $.ajax({
                    type: "POST",
                    url: "/save/" + fileName,
                    data: {"meiData": meiData,
                            "fileName": fileName}
                }) 
            }
        });
    }
    // Constructor reference
    Neon.prototype.constructor = Neon;

    Neon.prototype.loadData = loadData;
    Neon.prototype.loadPage = loadPage;
    Neon.prototype.refreshPage = refreshPage;
    Neon.prototype.saveMEI = saveMEI;
}

