/** @module Text */
import * as Controls from "./Controls.js";

/** @var {NeonView} */
var view;

var firstDiamond = false;
var messageSent = false;

/** @var {boolean} */
export var editText = false;

/**
 * Enable editing text and set listeners.
 * @param {NeonView} neonView
 */
export function enableEditText(neonView) {
    editText = true;
    view = neonView;
    Controls.setTextEdit();
    Controls.updateSylVisibility();
}

/**
 * Get the syllable text of the loaded file.
 * @returns {string}
 */
export function getSylText() {
    var lyrics = "";
    let uniToDash = /\ue551/g;
    let syllables = Array.from($(".syllable"));
    syllables.forEach(syllable => {
        if ($(syllable).has(".syl").length) {
            let syl = $(syllable).children(".syl")[0];
            lyrics += "<span class='" + syllable.id + "'>";
            Array.from(syl.children[0].children[0].children).forEach(text => {
                lyrics += text.textContent;
            });
            lyrics += " </span>";
        }
        else if (editText){
            lyrics += "<span class='" + syllable.id + "'>&#x25CA; </span>";
            firstDiamond = true;
        }
    });
    if (firstDiamond && !messageSent) {
        lyrics = "<h3>Blank syllables represented by &#x25CA;</h3><hr/>" + lyrics;
        messageSent = true;
    }
    return lyrics.replace(uniToDash, "-");
}

/**
 * Update the text for a syl tag by user input.
 * @param span
 */
export function updateSylText(span) {
    let orig = formatRaw($(span).html());
    let corrected = window.prompt("", orig);
    if (corrected !== null && corrected !== orig) {
        let editorAction = {
            "action": "setText",
            "param": {
                "elementId": $("#" + $(span).attr('class')).attr("id"),
                "text": corrected
            }
        };
        if (view.edit(editorAction))
            view.refreshPage();
    }
}

/**
 * Format a string for prompting the user.
 * @param {string} rawString
 * @returns {string}
 */
function formatRaw(rawString) {
    let removeSymbol = /\u{25CA}/u;
    return rawString.replace(removeSymbol, "").trim();
}
