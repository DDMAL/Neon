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
    var undoStack = new Array(0);
    var redoStack = new Array(0);

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

    function edit (editorAction, addToUndo = true) {
        let currentMEI = getMEI();
        let value = vrvToolkit.edit(editorAction);
        if (value && addToUndo) {
            undoStack.push(currentMEI);
            redoStack = new Array(0);
        }
        return value; 
    }

    function addStateToUndo() {
        undoStack.push(getMEI());
    }

    function info () {
        return vrvToolkit.editInfo();
    }

    function undo () {
        let state = undoStack.pop();
        if (state !== undefined) {
            redoStack.push(getMEI());
            loadData(state);
            return true;
        }
        return false;
    }

    function redo () {
        let state = redoStack.pop();
        if (state !== undefined) {
            undoStack.push(getMEI());
            loadData(state);
            return true;
        }
        return false;
    }

    // Constructor reference
    Neon.prototype.constructor = Neon;
    Neon.prototype.loadData = loadData;
    Neon.prototype.getSVG = getSVG;
    Neon.prototype.getMEI = getMEI;
    Neon.prototype.getElementAttr = getElementAttr;
    Neon.prototype.edit = edit;
    Neon.prototype.info = info;
    Neon.prototype.undo = undo;
    Neon.prototype.redo = redo;
    Neon.prototype.addStateToUndo = addStateToUndo;
}
