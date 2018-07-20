/** @module SelectOptions */

import * as Contents from "./Contents.js";
import * as Grouping from "./Grouping.js";

var neonView;

export function initNeonView(view) {
    neonView = view;
    Grouping.initNeonView(view);
}

//TODO: CHANGE NAVABAR-LINK TO PROPER ICON//
export function triggerNcActions(lastSelect) {
    endOptionsSelection();
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(Contents.ncActionContents);

    $("#Punctum.dropdown-item").on("click", (evt) => {
        let unsetInclinatum = {
            "action": "set",
            "param": {
                "elementId": lastSelect[0].id,
                "attrType": "name",
                "attrValue": ""
            }
        };
        let unsetVirga = {
            "action": "set",
            "param": {
                "elementId": lastSelect[0].id,
                "attrType": "diagonalright",
                "attrValue": ""
            }
        };
        neonView.edit({ "action": "chain", "param": [ unsetInclinatum, unsetVirga ]});
        neonView.refreshPage();
    });

    $("#Inclinatum.dropdown-item").on("click", (evt) => {
        let setInclinatum = {
            "action": "set",
            "param": {
                "elementId": lastSelect[0].id,
                "attrType": "name",
                "attrValue": "inclinatum"
            }
        };
        let unsetVirga = {
            "action": "set",
            "param": {
                "elementId": lastSelect[0].id,
                "attrType": "diagonalright",
                "attrValue": ""
            }
        };
        neonView.edit({ "action": "chain", "param": [ setInclinatum, unsetVirga ]});
        neonView.refreshPage();
    });

    $("#Virga.dropdown-item").on("click", (evt) => {
        let unsetInclinatum = {
            "action": "set",
            "param": {
                "elementId": lastSelect[0].id,
                "attrType": "name",
                "attrValue": ""
            }
        };
        let setVirga = {
            "action": "set",
            "param": {
                "elementId": lastSelect[0].id,
                "attrType": "diagonalright",
                "attrValue": "u"
            }
        };
        neonView.edit({ "action": "chain", "param": [ unsetInclinatum, setVirga ]});
        neonView.refreshPage();
    });

    initOptionsListeners();
}

//TODO: CHANGE NAVABAR-LINK TO PROPER ICON//
export function triggerNeumeActions() {
    endOptionsSelection()
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(Contents.neumeActionContents);
    Grouping.initGroupingListeners();
    initOptionsListeners();
}

export function triggerSylActions() {
    endOptionsSelection()
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(
        "<div><p class='control'>" +
        "<button class='button' id='ungroupNeumes'>Ungroup</button></p></div>"
    );
    Grouping.initGroupingListeners();
}

export function triggerClefActions() {
    endOptionsSelection();
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(
        "<label>Change Clef Shape:&nbsp;</label>" +
        "<div id='drop_select' class='dropdown'>" +
        "<div class='dropdown-trigger'>" +
        "<button id='select-options' class='button navbar-link' aria-haspopup='true' aria-controls='dropdown-menu'>" +
        "<span>Clef Shapes</span><span class='icon is-small'>" +
        "<i class=''></i></span></button></div>" +
        "<div class='dropdown-menu' id='dropdown-menu' role='menu'>" +
        "<div class='dropdown-content'>" +
        "<a id='Punctum' class='dropdown-item'>C Clef</a>" +
        "<a id='Inclinatum' class='dropdown-item'>F Clef</a></div></div></div>"
    );
    initOptionsListeners();
}

export function triggerStaffActions() {
    endOptionsSelection();
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(
        "<label>Merge Systems:&nbsp;</label>" +
        "<div><p class='control'>" +
        "<button id='merge-systems' class='button'>Merge</button></p></div>"
    );

    initOptionsListeners();

    $("#merge-systems").on("click", (evt) => {
        let systems = Array.from($(".staff.selected"));
        let elementIds = [];
        systems.forEach(staff => {
            elementIds.push(staff.id);
        });
        let editorAction = {
            "action": "merge",
            "param": {
                "elementIds": elementIds
            }
        };

        if (neonView.edit(editorAction)) {
            neonView.refreshPage();
        }
        else {
            alert("Could not merge systems. :(");
        }
    });
}

export function endOptionsSelection () {
    $("#moreEdit").empty();
    $("#moreEdit").addClass("is-invisible");
}

function initOptionsListeners(){
    $("#drop_select").on("click", function() {
        $(this).toggleClass("is-active");
    })
}
