function Neon () {

    //////////////
    // Constructor
    //////////////
    var vrvToolkit = new verovio.toolkit();
    var dragController = new DragController(this, vrvToolkit);
    var vrvOptions = {
        noLayout: 1,
        noFooter: 1,
        noHeader: 1
    };
    vrvToolkit.setOptions(vrvOptions);
    
    $.get("/mei/mei4page.mei", function(data) {
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

    function saveMei () {
        var meiData = vrvToolkit.getMEI();
        loadData(meiData);
    }

    // Constructor reference
    Neon.prototype.constructor = Neon;

    Neon.prototype.loadData = loadData;
    Neon.prototype.loadPage = loadPage;
    Neon.prototype.saveMei = saveMei;
}

