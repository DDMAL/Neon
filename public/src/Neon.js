function Neon () {

    //////////////
    // Constructor
    //////////////
    var vrvToolkit = new verovio.toolkit();
    var fileName = "mei4.mei";
    var dragController = new DragController(this, vrvToolkit);
    var vrvOptions = {
        // Width/Height needs to be set based on MEI information in the future
        pageHeight: 400,
        pageWidth: 600,
        noFooter: 1,
        noHeader: 1
    };
    vrvToolkit.setOptions(vrvOptions);
    
    $.get("/mei/" + fileName, function(data) {
        loadData(data);
        loadPage();
        dragController.dragInit();
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

