/** @module Warnings */

const $ = require('jquery');

/**
 * Warn when grouped neume components form an unrecognized neume.
 */
export function groupingNotRecognized() {
    if (!(confirm("Neon does not recognize this neume grouping. Would you like to create a compound neume?"))) {
        $("#undo").trigger("click");
    }
}
