function Neon () {

    //////////////
    // Constructor
    //////////////
    var vrvToolkit = new verovio.toolkit();
    var filePath = "/mei/mei4page.mei";
    var dragController = new DragController(this, vrvToolkit);
    var vrvOptions = {
        noLayout: 1,
        noFooter: 1,
        noHeader: 1
    };
    vrvToolkit.setOptions(vrvOptions);
    
    $.get(filePath, function(data) {
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

    // Constructor reference
    Neon.prototype.constructor = Neon;

    Neon.prototype.loadData = loadData;
    Neon.prototype.loadPage = loadPage;
    Neon.prototype.refreshPage = refreshPage;
}

