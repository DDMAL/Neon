/** @module SelectOptions */
import * as Contents from "./Contents.js";
import * as Grouping from "./Grouping.js";
import * as Notification from "./Notification.js";
import InfoBox from "./InfoBox.js";
import SplitHandler from "./SplitHandler.js";

/**
 * The NeonView parent to call editor actions.
 * @type {NeonView}
 */
var neonView;

/**
 * Initialize NeonView for this and {@link module:Grouping}
 * @param {NeonView} view - The parent NeonView.
 */
export function initNeonView(view) {
    neonView = view;
    Grouping.initNeonView(view);
}

/**
 * Return a JSON action that unsets the inclinatum parameter of an nc.
 * @param {string} id - The id of the neume component.
 * @returns {object}
 */
export function unsetInclinatumAction(id) {
    return {
        "action": "set",
        "param": {
            "elementId": id,
            "attrType": "name",
            "attrValue": ""
        }
    };
}

/**
 * Return a JSON action that unsets the virga parameter of an nc.
 * @param {string} id - The id of the neume component.
 * @returns {object}
 */
export function unsetVirgaAction(id) {
    return {
        "action": "set",
        "param": {
            "elementId": id,
            "attrType": "diagonalright",
            "attrValue": ""
        }
    };
}

//TODO: CHANGE NAVABAR-LINK TO PROPER ICON//
/**
 * Trigger the extra nc action menu.
 * @param {SVGSVGElement} nc - The last selected elements.
 */
export function triggerNcActions(nc) {
    endOptionsSelection();
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(Contents.ncActionContents);

    $("#Punctum.dropdown-item").on("click", (evt) => {
        let unsetInclinatum = unsetInclinatumAction(nc.id);
        let unsetVirga = unsetVirgaAction(nc.id);
        if(neonView.edit({ "action": "chain", "param": [ unsetInclinatum, unsetVirga ]})){
            Notification.queueNotification("Shape Changed");
        }
        else{
            Notification.queueNotification("Shape Change Failed");
        }
        endOptionsSelection();
        neonView.refreshPage();
    });

    $("#Inclinatum.dropdown-item").on("click", (evt) => {
        let setInclinatum = {
            "action": "set",
            "param": {
                "elementId": nc.id,
                "attrType": "name",
                "attrValue": "inclinatum"
            }
        };
        let unsetVirga = unsetVirgaAction(nc.id);
        if(neonView.edit({ "action": "chain", "param": [ setInclinatum, unsetVirga ]})){
            Notification.queueNotification("Shape Changed");
        }
        else{
            Notification.queueNotification("Shape Change Failed");
        }
        endOptionsSelection();
        neonView.refreshPage();
    });

    $("#Virga.dropdown-item").on("click", (evt) => {
        let unsetInclinatum = unsetInclinatumAction(nc.id);
        let setVirga = {
            "action": "set",
            "param": {
                "elementId": nc.id,
                "attrType": "diagonalright",
                "attrValue": "u"
            }
        };
        if(neonView.edit({ "action": "chain", "param": [ unsetInclinatum, setVirga ]})){
            Notification.queueNotification("Shape Changed");
        }
        else{
            Notification.queueNotification("Shape Change Failed");
        }
        endOptionsSelection();
        neonView.refreshPage();
    });

    initOptionsListeners();
}

/**
 * Trigger extra neume actions.
 */
export function triggerNeumeActions() {
    endOptionsSelection()
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(Contents.neumeActionContents);
    var neume = $(".selected");
    if (neume.length != 1){
        console.warn("More than one neume selected! Cannot trigger Neume ClickSelect actions.");
        return;
    }

    $(".grouping").on("click", (e) => {
        var contour = InfoBox.getContourByValue(e.target.id);
        triggerChangeGroup(contour);
    });

    function triggerChangeGroup(contour) {
        let changeGroupingAction = {
            "action": "changeGroup",
            "param": {
                "elementId": neume[0].id,
                "contour": contour
            }
        }
        if(neonView.edit(changeGroupingAction)){
            Notification.queueNotification("Grouping Changed");
        }
        else{
            Notification.queueNotification("Grouping Failed");
        }
        endOptionsSelection();
        neonView.refreshPage();
    }
    initOptionsListeners();
    Grouping.initGroupingListeners();
}

/**
 * Trigger extra syllable actions.
 */
export function triggerSylActions() {
    endOptionsSelection()
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(
        "<div><p class='control'>" +
        "<button class='button' id='ungroupNeumes'>Ungroup</button></p></div>"
    );
    Grouping.initGroupingListeners();
}

/**
 * Trigger extra clef actions.
 */
export function triggerClefActions(clef) {
    endOptionsSelection();
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(Contents.clefActionContents);
    $("#CClef.dropdown-item").on("click", (evt) => {
        let setCClef = {
            "action": "setClef",
            "param": {
                "elementId": clef.id,
                "shape": "C"
            }
        }
        if(neonView.edit(setCClef)){
            Notification.queueNotification("Shape Changed");
        }
        else{
            Notification.queueNotification("Shape Change Failed");
        }
        endOptionsSelection();
        neonView.refreshPage();
    })
    $("#FClef.dropdown-item").on("click", (evt) => {
        let setFClef = {
            "action": "setClef",
            "param": {
                "elementId": clef.id,
                "shape": "F"
            }
        }
        if(neonView.edit(setFClef)){
            Notification.queueNotification("Shape Changed");
        }
        else{
            Notification.queueNotification("Shape Change Failed");
        }
        endOptionsSelection();
        neonView.refreshPage();
    })
    initOptionsListeners();
}

/**
 * Trigger extra staff actions.
 */
export function triggerStaffActions() {
    endOptionsSelection();
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(Contents.staffActionContents);

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
            Notification.queueNotification("Staff Merged");
            endOptionsSelection();
            neonView.refreshPage();
        }
        else {
            Notification.queueNotification("Merge Failed");
        }
    });
}

/**
 * Trigger split staff option
 */
export function triggerSplitActions() {
    endOptionsSelection();
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(Contents.splitActionContents);

    //TODO add trigger for split action
    $("#split-system").on("click", (evt) => {
        var split = new SplitHandler(neonView);
        split.startSplit();
        endOptionsSelection();
    });
}

/**
 * End the extra options menu.
 */
export function endOptionsSelection () {
    $("#moreEdit").empty();
    $("#moreEdit").addClass("is-invisible");
}

/**
 * Initialize extra dropdown options.
 */
function initOptionsListeners(){
    $("#drop_select").on("click", function() {
        $(this).toggleClass("is-active");
    })
}
