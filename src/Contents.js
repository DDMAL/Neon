/** @module Contents */

import PunctumIcon from "./img/punctum.png";
import VirgaIcon from "./img/virga.png";
import DiamondIcon from "./img/diamond.png";
import WhitePunctumIcon from "./img/white_punct.png";
import QuilismaIcon from "./img/quilisma.png";
import CustosIcon from "./img/custos.png";
import CClefIcon from "./img/cClef.png";
import FClefIcon from "./img/fClef.png";
import StaffIcon from "./img/staff.png";
import SmallDivIcon from "./img/smallDiv.png";
import MinorDivIcon from "./img/minorDiv.png";
import MajorDivIcon from "./img/majorDiv.png";
import FinalDivIcon from "./img/finalDiv.png";

/**
 * HTML for each insert tab (neume, grouping, clef, system, and division).
 * @type {object}
 */
export const insertTabHtml = {
    neumeTab: "<p class='control'>" +
        "<button id='punctum' class='button insertel smallel' title='punctum'><img src='" + PunctumIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='virga' class='button insertel smallel' title='virga'><img src='" + VirgaIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='diamond' class='button insertel smallel' title='inclinatum'><img src='" + DiamondIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='white_punct' class='button insertel smallel' title='white punctum'><img src='" + WhitePunctumIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='quilisma' class='button insertel smallel' title='quilisma'><img src='" + QuilismaIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='custos' class='button insertel smallel' title='custos'><img src='" + CustosIcon + "' class='image'/></button></p>",
    groupingTab: "<p class='control'>" +
        "<button id='torculus' class='button insertel smallel' title='torculus'><img src='' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='clivis' class='button insertel smallel' title='clivis'><img src='' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='pes' class='button insertel smallel' title='pes'><img src='' class='image'/></button></p>",
    clefTab: "<p class='control'>" +
        "<button id='cClef' class='button insertel smallel' title=' C Clef'><img src='" + CClefIcon + "' class='image' /></button></p>" +
        "<p class='control'>" +
        "<button id='fClef' class='button insertel smallel' title='F Clef'><img src='" + FClefIcon + "' class='image'/></button></p>",
    systemTab: "<p class='control'>" +
        "<button id='staff' class='button insertel longel' title='system'><img src='" + StaffIcon + "' class='image' /></button></p>", 
    divisionTab: "<p class='control'>" +
        "<button id='smallDiv' class='button insertel tallel'><img src='" + SmallDivIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='minorDiv' class='button insertel tallel'><img src='" + MinorDivIcon +"' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='majorDiv' class='button insertel tallel'><img src='" + MajorDivIcon + "' class='image'/></button></p>" +
        "<p class='control'>" +
        "<button id='finalDiv' class='button insertel tallel'><img src='" + FinalDivIcon + "' class='image'/></button></p>"
};

/**
 * Contents of navbar menu after switching to edit mode.
 * @type {string}
 */
export const navbarDropdownMenu =
    "<div class='navbar-item has-dropdown is-hoverable'><a class='navbar-link'>File</a>" +
    "<div class='navbar-dropdown'>" +
    "<a id='getmei' class='navbar-item' href='' download=''> Download MEI </a>" +
    "<a id='getpng' class='navbar-item' href='' download=''> Download PNG </a>" +
    "<a id='revert' class='navbar-item' href=''> Revert </a>";

/**
 * Structure of insert panel with basic grouping tabs.
 * @type {string}
 */
export const insertControlsPanel =
    "<p class='panel-heading' id='insertMenu'>Insert</p>" +
    "<div id='insertContents'>" +
    "<p class='panel-tabs'>" +
    "<a id='neumeTab' class='insertTab'>Neume</a>" +
    "<a id='groupingTab' class='insertTab'>Grouping</a>" +
    "<a id='clefTab' class='insertTab'>Clef</a>" +
    "<a id='systemTab' class='insertTab'>System</a>" +
    "<a id='divisionTab' class='insertTab'>Division</a></p>" +
    "<a class='panel-block has-text-centered'>" +
    "<div id='insert_data' class='field is-grouped'/></a></div>";

/**
 * Contents of edit panel with buttons.
 * @type {string}
 */
export const editControlsPanel =
    "<p class='panel-heading' id='editMenu'>Edit</p>" +
    "<div id='editContents'>" +
    "<a class='panel-block'>" +
    "<label>Select By:&nbsp;</label>" +
    "<div class='field has-addons'>" +
    "<p class='control'>" + 
    "<button class='button is-active' id='selByNeume'>Neume</button></p>" +
    "<p class='control'>" +
    "<button class='button' id='selByNc'>Neume Component</button></p>" +
    "<p class='control'>" +
    "<button class='button' id='selByStaff'>Staff</button></p></div></a>" +
    "<a class='panel-block'>" + 
    "<div class='field is-grouped'>" +
    "<p class='control'>" +
    "<button class='button' id='undo'>Undo</button></p>" +
    "<p class='control'>" +
    "<button class='button' id='redo'>Redo</button></p>" +
    "<p class='control'>" +
    "<button class='button' id='save'>Save Changes</button></p>" +
    "<p class='control'>" +
    "<button class='button' id='delete'>Delete</button></p></div></a>" +
    "<a id='moreEdit' class='panel-block is-invisible'>" + 
    "<a id='neumeEdit' class='panel-block is-invisible'></div>";

/**
 * Contents of extra nc action menu.
 * @type {string}
 */
export const ncActionContents =
        "<label>Change Head Shape:&nbsp;</label>" +
        "<div id='drop_select' class='dropdown'>" +
        "<div class='dropdown-trigger'>" +
        "<button id='select-options' class='button navbar-link' aria-haspopup='true' aria-controls='dropdown-menu'>" +
        "<span>Head Shapes</span><span class='icon is-small'>" +
        "<i class=''></i></span></button></div>" +
        "<div class='dropdown-menu' id='dropdown-menu' role='menu'>" +
        "<div class='dropdown-content'>" +
        "<a id='Punctum' class='dropdown-item'>Punctum</a>" +
        "<a id='Virga' class='dropdown-item'>Virga</a>" +
        "<a id='Inclinatum' class='dropdown-item'>Inclinatum</a></div></div></div>";

/**
 * Contents of extra neume action menu.
 * @type {string}
 */
export const neumeActionContents =
        "<label>Change Grouping:&nbsp;</label>" +
        "<div id='drop_select' class='dropdown'>" +
        "<div class='dropdown-trigger'>" +
        "<button id='select-options' class='button navbar-link' aria-haspopup='true' aria-controls='dropdown-menu'>" +
        "<span>Groupings</span><span class='icon is-small'>" +
        "<i class=''></i></span></button></div>" +
        "<div class='dropdown-menu' id='dropdown-menu' role='menu'>" +
        "<div class='dropdown-content'>" +
        "<a id='Torculus' class='dropdown-item'>Torculus</a></div></div></div>" +
        "<div><p class='control'>" +
        "<button class='button' id='ungroup'>Ungroup</button></p></div>";

/**
 * Contents of extra staff action menu.
 * @type {string}
 */
export const staffActionContents =
    "<label>Merge Systems:&nbsp;</label>" +
    "<div><p class='control'>" +
    "<button id='merge-systems' class='button'>Merge</button></p></div>";

/**
 * HTML for grouping selection menu.
 * @type {string}
 */
export const groupingMenu =
    "<label>Select Grouping:&nbsp;</label>" +
    "<div id='grouping_dropdown' class='dropdown'>" +
    "<div class='dropdown-trigger'>" +
    "<button id='select-options' class='button navbar-link' aria-haspopup='true' aria-controls='dropdown-menu'>" +
    "<span>Groupings</span><span class='icon is-small'>" +
    "<i class=''></i></span></button></div>" +
    "<div class='dropdown-menu' id='dropdown-menu' role='menu'>" +
    "<div class='dropdown-content'>" +
    "<a id='Torculus' class='dropdown-item'>Torculus</a>" +
    "<a id='' class='dropdown-item'>Etc...</a></div></div></div>" +
    "<div><p class='control'>" +
    "<button class='button' id='ungroup'>Ungroup</button></p></div>";
