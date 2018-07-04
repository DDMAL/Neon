export default function Neon (mei, vrvToolkit) {
    
    //////////////
    // Constructor
    //////////////
    var vrvOptions = {
        noFooter: 1,
        noHeader: 1,
        pageMarginLeft: 0,
        pageMarginTop: 0,
        font: "Bravura",
    };
    vrvToolkit.setOptions(vrvOptions);
    loadData(mei);

    function loadData (data) {
        vrvToolkit.loadData(data);
    }

    function getSVG () {
        return vrvToolkit.renderToSVG(1);
    }

    function getMEI () {
        return vrvToolkit.getMEI();
    }

    function getElementAttr (elementId) {
        return vrvToolkit.getElementAttr(elementId);
    }

    function edit (editorAction) {
        return vrvToolkit.edit(editorAction);
    }

    // Constructor reference
    Neon.prototype.constructor = Neon;
    Neon.prototype.loadData = loadData;
    Neon.prototype.getSVG = getSVG;
    Neon.prototype.getMEI = getMEI;
    Neon.prototype.getElementAttr = getElementAttr;
    Neon.prototype.edit = edit;
}
