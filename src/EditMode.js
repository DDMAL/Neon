import DragHandler from "./DragHandler.js";
import GroupingHandler from "./GroupingHandler.js";
import Navbar from "./Navbar.js";
import Select from "./Select.js";
import CursorHandler from "./CursorHandler.js";
import InsertControls from "./InsertControls.js";
import InsertHandler from "./InsertHandler.js";
import DragSelect from "./DragSelect.js"

export default function EditMode (neonView, meiFile, zoomHandler){
    var dragHandler = null;
    var groupingHandler = null;
    var navbarHandler = null;
    var select = null;
    var insertControls = null;
    var cursorHandler = null;
    var dragSelect = null;
    var insertHandler = null;
    var vbHeight = null;
    var vbWidth = null;


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
            "<a id='groupingTab' class='insertTab'>Grouping</a>" +
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
            "<button class='button' id='selByNc'>Neume Component</button></p></div></a>" +
            "<a class='panel-block'>" + 
            "<div class='field is-grouped'>" +
            "<p class='control'>" +
            "<button class='button' id='undo'>Undo</button></p>" +
            "<p class='control'>" +
            "<button class='button' id='redo'>Redo</button></p>" +
            "<p class='control'>" +
            "<button class='button' id='save'>Save Changes</button></p></div></a>" +
            "<a id='moreEdit' class='panel-block is-invisible'>" + 
            "<a id='neumeEdit' class='panel-block is-invisible'>"
        );

        init();
    })

    function init() {
        dragHandler = new DragHandler(neonView);
        groupingHandler = new GroupingHandler();
        navbarHandler = new Navbar(meiFile);
        select = new Select(dragHandler, groupingHandler);
        cursorHandler = new CursorHandler();
        insertHandler = new InsertHandler(neonView);
        insertControls = new InsertControls(cursorHandler, insertHandler);
        dragSelect = new DragSelect(dragHandler, zoomHandler, groupingHandler);
    }

    function resetListeners() {
        select.selectListeners();
    }

    ////// TODO: pass to cursorHandler to scale insert image ///////
    // function getScale() {
    //     var viewBox = d3.select("#svg_group").attr("viewBox");
    //     vbHeight = parseInt(viewBox.split(" ")[3]);
    //     vbWidth = parseInt(viewBox.split(" ")[2]);
    // }

    EditMode.prototype.resetListeners = resetListeners;
    // EditMode.prototype.getScale = getScale;
}
