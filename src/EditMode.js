import DragHandler from "./DragHandler.js";
import {ClickSelect, DragSelect} from "./Select.js";
import InsertHandler from "./InsertHandler.js";
import * as Controls from "./Controls.js";
import * as Contents from "./Contents.js";
import * as SelectOptions from "./SelectOptions.js";
import * as Text from "./Text.js";
import * as Notification from "./Notification.js";

/**
 * Creates user interface for editing and creates necessary tools.
 * @constructor
 * @param {NeonView} neonView - The NeonView parent object.
 * @param {string} meiFile - The path to the MEi file.
 * @param {module:Zoom~ZoomHandler} zoomHandler - The ZoomHandler object.
 */
function EditMode (neonView, meiFile, zoomHandler){
    var dragHandler = null;
    var selectOptions = null;
    var select = null;
    var insertControls = null;
    var dragSelect = null;
    var insertHandler = null;
    // var vbHeight = null;
    // var vbWidth = null;


    // Set edit mode listener
    Controls.initEditMode(this);

    /**
     * Initialize handlers and controls and create event listeners.
     */
    function init() {
        Notification.queueNotification("Edit Mode");
        dragHandler = new DragHandler(neonView);
        Controls.initNavbar(meiFile, neonView);
        select = new ClickSelect(dragHandler, zoomHandler, neonView);
        insertHandler = new InsertHandler(neonView);
        Controls.bindInsertTabs(insertHandler);
        $("#neumeTab").click();
        dragSelect = new DragSelect(dragHandler, zoomHandler, neonView);
        SelectOptions.initNeonView(neonView);

        Controls.initInsertEditControls(neonView);
        Text.enableEditText(neonView);
    }

    /**
     * Reset select event listeners.
     */
    function resetListeners() {
        select.selectListeners();
    }

    ////// TODO: pass to cursorHandler to scale insert image ///////
    // function getScale() {
    //     var viewBox = d3.select("#svg_group").attr("viewBox");
    //     vbHeight = parseInt(viewBox.split(" ")[3]);
    //     vbWidth = parseInt(viewBox.split(" ")[2]);
    // }

    function isInsertMode() {
        return insertHandler.isInsertMode();
    }

    EditMode.prototype.init = init;
    EditMode.prototype.resetListeners = resetListeners;
    EditMode.prototype.isInsertMode = isInsertMode;
    // EditMode.prototype.getScale = getScale;
}

export {EditMode as default};
