/** @module Grouping */
import * as Contents from "./Contents.js";

/**
 * Trigger the grouping selection menu.
 */
export function triggerGroupSelection () {
    $("#moreEdit").removeClass("is-invisible");
    $("#moreEdit").append(Contents.groupingMenu );
    initGroupingListeners();
};

/**
 * Remove the grouping selection menu.
 */
export function endGroupingSelection () {
    $("#moreEdit").empty();
    $("#moreEdit").addClass("is-invisible");
}

/**
 * The grouping dropdown listener.
 */
function initGroupingListeners(){
    $("#grouping_dropdown").on("click", function() {
        $(this).toggleClass("is-active");
    })

}
