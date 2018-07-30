/**
 * Handle compatibility between standalone and Rodan versions of Neon.
 * Ideally the rest of the program doesn't need to know which version it's in.
 * @module compatibility
 */

/**
 * The modes to run Neon in.
 * Either standalone (0) or rodan (1).
 */
export const modes = {
    standalone: 0,
    rodan: 1
};

var mode;

/**
 * Set the mode to run Neon in.
 * @param {@module:compatibility~modes} currentMode
 */
export function setMode(currentMode) {
    mode = currentMode;
}

/**
 * Return the mode Neon is in.
 * @returns {integer}
 */
export function getMode() {
    return mode;
}

/**
 * Compatible save file function.
 * @param {string} filename - The path for the MEI file.
 * @param {string} mei - The MEI data.
 */
export function saveFile(filename, mei) {
    var pathSplit = filename.split('/');
    let file = pathSplit[pathSplit.length - 1];

    if (mode === modes.standalone) {
        $.ajax(
            {
                type: "POST",
                url: "/save/" + file,
                data: {
                    "meiData": mei,
                    "fileName": filename
                }
            }
        );
    }
    else if (mode === modes.rodan) {
        console.warning("Rodan save not yet implemented!");
    }
    else {
        console.error("Unsupported or unset mode!");
    }
}

/**
 * Compatible revert function.
 * @param {string} filename
 */
export function revertFile(filename) {
    if (mode === modes.standalone) {
        $.ajax({
            type: "POST",
            url: "/revert/" + filename
        });
    }
    else if (mode === modes.rodan) {
        console.warning("Rodan revert not yet implemented!");
    }
    else {
        console.error("Unsupported or unset mode!");
    }
}

/**
 * Compatible autosave function.
 * @param {string} filename
 * @param {string} mei
 */
export function autosave(filename, mei) {
    var pathSplit = filename.split('/');
    let file = pathSplit[pathSplit.length - 1];

    if (mode === modes.standalone) {
        $.ajax({
            "type": "POST",
            "url": "/autosave/" + file,
            "data": {
                "data": "data"
            }
        });
    }
    else if (mode === modes.rodan) {
        console.warning("Rodan autosave not yet implemented");
    }
    else {
        console.error("Unsupported or unset mode!");
    }
}
