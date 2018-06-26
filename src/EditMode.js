import DragHandler from "./DragHandler";
import Navbar from "./Navbar.js";
import EditControls from "./EditControls";
import CursorHandler from "./CursorHandler";
import InsertControls from "./InsertControls";

export default function EditMode (neon, meiFile, vrvToolkit){
    var dragHandler = null;
    var navbarHandler = null;
    var editControls = null;
    var insertControls = null;
    var cursorHandler = null;

    // Set edit mode listener
    $("#edit_mode").on("click", function(){
        $("#dropdown_toggle").empty();
        $("#dropdown_toggle").append(  
            "<div class='navbar-item has-dropdown is-hoverable'><a class='navbar-link'>File</a>" +
            "<div class='navbar-dropdown'>" +
            "<a id='getmei' class='navbar-item' href='' download=''> Download MEI </a>" +
            "<a id='getpng' class='navbar-item' href='' download=''> Download PNG </a>" +
            "<a id='revert' class='navbar-item' href=''> Revert </a>"
        );
        $("#edit_controls").append(
            "<p class='panel-heading'>Insert</p>" +
            "<p class='panel-tabs'>" +
            "<a id='neumeTab' class='insertTab'>Neume</a>" +
            "<a id='clefTab' class='insertTab'>Clef</a>" +
            "<a id='systemTab' class='insertTab'>System</a>" +
            "<a id='divisionTab' class='insertTab'>Division</a></p>" +
            "<a class='panel-block has-text-centered'>" +
            "<div id='insert_data' class='field is-grouped'/></a>" +
            "<p class='panel-heading'>Edit</p><p class='panel-tabs'></p>"
        );

        init();
    })

    function init() {
        dragHandler = new DragHandler(neon, vrvToolkit)
        navbarHandler = new Navbar(meiFile);
        editControls = new EditControls();
        cursorHandler = new CursorHandler();
        insertControls = new InsertControls(cursorHandler);

        dragHandler.dragInit();
    }

    function initializeListeners () {
        if (dragHandler !== null) { dragHandler.dragInit(); }
    }

    EditMode.prototype.initializeListeners = initializeListeners;
}
