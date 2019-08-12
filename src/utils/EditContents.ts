/** @module utils/EditContents */

/**
 * Contents of navbar menu after switching to edit mode.
 * @type {string}
 */
export const navbarDropdownMenu =
    "<div class='navbar-item has-dropdown is-hoverable'><a class='navbar-link'>File</a>" +
    "<div id='navbar-dropdown-options' class='navbar-dropdown'>" +
    "<a id='save' class='navbar-item'>Save</a>" +
    "<a id='export' class='navbar-item'>Save and Export to File</a>" +
    "<a id='getmei' class='navbar-item' href='' download=''> Download MEI </a>" +
    "<a id='revert' class='navbar-item'> Revert </a>";

/**
 * Finalize option in the navbar for rodan
 * @type {string}
 */
export const navbarFinalize =
    "<a id='finalize' class='navbar-item'> Finalize MEI </a>";

/**
 * Contents of the undo/redo panel with buttons
 * @type {string}
 */
export const undoRedoPanel =
    "<div class='field has-addons buttons' style='overflow-x: auto;'>" +
    "<p class='control'>" +
    "<button class='button' id='undo'>Undo</button>" +
    "<button class='button' id='redo'>Redo</button></p></a></div>";
