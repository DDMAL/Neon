/**
 * Underlying NeonCore class that communicates with Verovio.
 * @constructor
 * @param {string} mei - Contents of the MEI file.
 * @param {object} vrvToolkit - An instantiated Verovio toolkit.
 */
function NeonCore (mei, vrvToolkit) {
  /// ///////////
  // Constructor
  /// ///////////
  var vrvOptions = {
    inputFormat: 'mei',
    noFooter: 1,
    noHeader: 1,
    pageMarginLeft: 0,
    pageMarginTop: 0,
    font: 'Bravura'
  };
  var undoStack = new Array(0);
  var redoStack = new Array(0);

  vrvToolkit.setOptions(vrvOptions);
  loadData(mei);

  /**
     * Load MEI data into Verovio.
     * @param {string} data - MEI data.
     */
  function loadData (data) {
    vrvToolkit.loadData(data);
  }

  /**
     * Get the SVG from Verovio.
     * @returns {string}
     */
  function getSVG () {
    return vrvToolkit.renderToSVG(1);
  }

  /**
     * Get the MEI data from Verovio.
     * @returns {string}
     */
  function getMEI () {
    return vrvToolkit.getMEI(0, true);
  }

  /**
     * Get MEI element attributes from Verovio.
     * @param {string} elementId - The ID of the MEI element.
     * @returns {object}
     */
  function getElementAttr (elementId) {
    return vrvToolkit.getElementAttr(elementId);
  }

  /**
     * Execute an editor action in Verovio.
     * @param {object} editorAction - The action to execute.
     * @param {boolean} [addToUndo=true] - Whether or not to make this action undoable.
     * @returns {boolean}
     */
  function edit (editorAction, addToUndo = true) {
    let currentMEI = getMEI();
    // console.log(editorAction); // Useful for debugging actions
    let value = vrvToolkit.edit(editorAction);
    if (value && addToUndo) {
      undoStack.push(currentMEI);
      redoStack = new Array(0);
    }
    return value;
  }

  function addStateToUndo () {
    undoStack.push(getMEI());
  }

  /**
     * Get additional information on the last editor action from Verovio.
     * @returns {string}
     */
  function info () {
    return vrvToolkit.editInfo();
  }

  /**
     * Undo the last editor action.
     * @returns {boolean}
     */
  function undo () {
    let state = undoStack.pop();
    if (state !== undefined) {
      redoStack.push(getMEI());
      loadData(state);
      return true;
    }
    return false;
  }

  /**
     * Redo an undone action.
     * @returns {boolean}
     */
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
  NeonCore.prototype.constructor = NeonCore;
  NeonCore.prototype.loadData = loadData;
  NeonCore.prototype.getSVG = getSVG;
  NeonCore.prototype.getMEI = getMEI;
  NeonCore.prototype.getElementAttr = getElementAttr;
  NeonCore.prototype.edit = edit;
  NeonCore.prototype.info = info;
  NeonCore.prototype.undo = undo;
  NeonCore.prototype.redo = redo;
  NeonCore.prototype.addStateToUndo = addStateToUndo;
}

export { NeonCore as default };
