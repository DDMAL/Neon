/** @module Text */

/**
 * Get the syllable text of the loaded file.
 * @returns {string}
 */
export function getSylText() {
    var lyrics = "";
    let uniToDash = /\ue551/g;
    let syls = Array.from($(".syl"));
    syls.forEach(syllable => {
        Array.from(syllable.children[0].children[0].children).forEach(text => {
            lyrics += text.textContent;
        });
        lyrics += " ";
    });
    return lyrics.trim().replace(uniToDash, "-");
}
