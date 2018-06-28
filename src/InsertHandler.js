export default function InsertHandler (neonView) {
    var type = "";

    function insertActive (buttonId) {
        console.log("InsertHandler Active!");
        if (buttonId === "punctum") {
            type = "nc";
            $("body").on("click", "#svg_output", handler);
        }
        else {
            type = "";
            console.error("Invalid button for insertion: " + buttonId + ".");
        }
    }

    function insertDisabled () {
        console.log("InsertHandler Not Active!");
        type = "";
        $("body").off("click", "#svg_output", handler);
    }

    function handler (evt) {
        var container = document.getElementById("svg_container");
        var group = document.getElementById("svg_group");
        var pt = group.createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        //Transform pt to SVG context
        var transformMatrix = group.getScreenCTM();
        console.log(transformMatrix);
        var cursorpt = pt.matrixTransform(transformMatrix.inverse());
        
        // TODO Find closest staff to attach to
        var staffId = "m-adc4f225-5574-422d-8c4d-9781a3dab529";

        let editorAction = {
            "action": "insert",
            "param": {
                "elementType": type,
                "staffId": staffId,
                "ulx": cursorpt.x,
                "uly": cursorpt.y
            }
        };
        console.log(editorAction);
        neonView.edit(editorAction);
        neonView.refreshPage();
        insertDisabled();
    }

    InsertHandler.prototype.constructor = InsertHandler;
    InsertHandler.prototype.insertActive = insertActive;
    InsertHandler.prototype.insertDisabled = insertDisabled;
}
