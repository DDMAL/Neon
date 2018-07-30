/**
 * Handle compatibility between standalone and Rodan versions of Neon.
 * Ideally the rest of the program doesn't need to know which version it's in.
 * @module compatibility
 */

export const modes = {
    standalone: 0,
    rodan: 1
};

var mode;

export function setMode(currentMode) {
    mode = currentMode;
}

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
