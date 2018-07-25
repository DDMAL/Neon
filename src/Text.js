/** @module Text */
import * as Controls from "./Controls.js";

/** @var {NeonView} */
var view;

/** @var {boolean} */
export var editText = false;

/**
 * Enable editing text and set listeners.
 */
export function enableEditText(neonView) {
    editText = true;
    view = neonView;
    Controls.setTextEdit(view);
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
        else {
            lyrics += "<span class='" + syllable.id + "'> </span>";
        }
    });
    return lyrics.trim().replace(uniToDash, "-");
}

export function updateSylText(span) {
    let orig = formatRaw($(span).html());
    let corrected = window.prompt("", orig);
    if (corrected !== null && corrected !== orig) {
        let editorAction = {
            "action": "setText",
            "param": {
                "elementId": $("#" + $(span).attr('class')).children(".syl").attr("id"),
                "text": corrected
            }
        };
        console.log(editorAction);
        if (view.edit(editorAction))
            view.refreshPage();
    }
}

function formatRaw(rawString) {
    return rawString.trim();
}
