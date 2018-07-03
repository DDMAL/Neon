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
        var container = document.getElementsByClassName("definition-scale")[0];
        var pt = container.createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        //Transform pt to SVG context
        var transformMatrix = container.getScreenCTM();
        var cursorpt = pt.matrixTransform(transformMatrix.inverse());
        
        let editorAction = {
            "action": "insert",
            "param": {
                "elementType": type,
                "staffId": "auto",
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
