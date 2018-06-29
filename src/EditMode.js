import DragHandler from "./DragHandler.js";
import Navbar from "./Navbar.js";
<<<<<<< HEAD
import EditControls from "./EditControls.js";
import CursorHandler from "./CursorHandler.js";
import InsertControls from "./InsertControls.js";
=======
import EditControls from "./EditControls";
import CursorHandler from "./CursorHandler";
import InsertControls from "./InsertControls";
import DragSelect from "./DragSelect";
>>>>>>> feature/drag-select

export default function EditMode (neonView, meiFile){
    var dragHandler = null;
    var navbarHandler = null;
    var editControls = null;
    var insertControls = null;
    var cursorHandler = null;
    var dragSelect = null;

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
        $("#insert_controls").append(
            "<p class='panel-heading' id='insertMenu'>Insert</p>" +
            "<p class='panel-tabs'>" +
            "<a id='neumeTab' class='insertTab'>Neume</a>" +
            "<a id='clefTab' class='insertTab'>Clef</a>" +
            "<a id='systemTab' class='insertTab'>System</a>" +
            "<a id='divisionTab' class='insertTab'>Division</a></p>" +
            "<a class='panel-block has-text-centered'>" +
            "<div id='insert_data' class='field is-grouped'/></a>"
        );
        $("#edit_controls").append(
            "<p class='panel-heading' id='editMenu'>Edit</p>" +
            "<a class='panel-block'>" +
            "<label>Select By:&nbsp;</label>" +
            "<div class='field has-addons'>" +
            "<p class='control'>" + 
            "<button class='button is-active' id='selByNeume'>Neume</button></p>" +
            "<p class='control'>" +
            "<button class='button' id='selByNc'>Neume Component</button></p></div></a>"
        );

        init();
    })

    function init() {
        dragHandler = new DragHandler(neonView)
        navbarHandler = new Navbar(meiFile);
        editControls = new EditControls();
        cursorHandler = new CursorHandler();
        insertControls = new InsertControls(cursorHandler);
        dragSelect = new DragSelect();

        //dragHandler.dragInit();
    }

    function initializeListeners () {
        if (dragHandler !== null) { dragHandler.dragInit(); }
    }

    EditMode.prototype.initializeListeners = initializeListeners;
}
