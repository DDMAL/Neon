/**
 * Gets information on musical elements and displays them.
 * @constructor
 * @param {NeonView} neon - The NeonView parent
 */
function InfoBox(neon) {
    /**
     * Set the info box listener on neumes, clefs, and custos.
     */
    function infoListeners() {
        $(".neume,.custos,.clef").on("mouseover", setInfo);
    }

    function setInfo() {
        updateInfo(this.id);
    }

    function setInfoClef() {
        if (neon.getElementAttr(this.id).shape !== undefined) {
            updateInfo(this.id);
        }
        else {
            updateInfo(this.parentNode.id);
        }
    }

    /**
     * Gets element info from Verovio and updates/creates the info box.
     * @param {string} id - The element ID
     */
    function updateInfo(id) {
        // For now, since Clefs do not have their own element tag in mei4, there is not a way to select the <g> element
        // So we will simply return if ID does not exist for now
        if (id == "") {
            $("#neume_info").empty();
            console.log("No id!");
            return;
        }

        var element = $("#" + id);
        var classRe = /neume|nc|clef|custos|staff/;
        var elementClass = element.attr("class").match(classRe)[0];
        var body = "";

        // Gets the pitches depending on element type and 
        switch(elementClass) {
            case "neume":
                // Select neume components of selected neume
                var ncs = element.children(".nc");
                var contour = getContour(ncs);
                var pitches = getPitches(ncs);
                
                pitches = pitches.trim().toUpperCase();
                body = "Shape: " + (contour === undefined ? "Compound" : contour) + "<br/>"
                    + "Pitch(es): " + pitches;
                break;
            case "custos":
                var attributes = neon.getElementAttr(id);
                body += "Pitch: " + (attributes.pname).toUpperCase() + attributes.oct;
                break;
            case "clef":
                var attributes = neon.getElementAttr(id);
                body += "Shape: " + attributes.shape + "<br/>"
                    + "Line: " + attributes.line;
                break;
            case "staff":
                elementClass = "clef";
                var staffDefAttributes = neon.getElementStaffDef(id);
                body = "Shape: " + staffDefAttributes["clef.shape"] + "<br/>"
                    + "Line: " + staffDefAttributes["clef.line"];
                break;
            default:
                body += "nothing";
                break;
        }
        updateInfoBox(elementClass, body);
    }

    /**
     * Get the individual pitches of a neume.
     * @param {array} ncs - neume components in the neume. 
     */
    function getPitches (ncs) {
        var pitches = "";
        ncs.each( function () {
            var attributes = neon.getElementAttr(this.id);
            pitches += attributes.pname + attributes.oct + " ";
        });
        return pitches;
    }

    /**
     * Get the contour of a neume.
     * @param {array} ncs - neume components in the neume. 
     */
    function getContour (ncs) {
        var contour = "";
        var previous = null;
        ncs.each( function () {
            var attributes = neon.getElementAttr(this.id);
            if (previous !== null) {
                if (previous.oct > attributes.oct) {
                    contour += "d";
                }
                else if (previous.oct < attributes.oct) {
                    contour += "u";
                }
                else {
                    if (pitchNameToNum(previous.pname) < pitchNameToNum(attributes.pname)) {
                        contour += "u";
                    }
                    else if (pitchNameToNum(previous.pname) > pitchNameToNum(attributes.pname)) {
                        contour += "d";
                    }
                    else {
                        contour += "s";
                    }
                }
            }
            previous = attributes;
        });
        if (neumeGroups.get(contour) === undefined) {
            console.warn("Unknown contour: " + contour);
        }
        return neumeGroups.get(contour);
    }
    
    /**
     * Show and update the info box.
     * @param {string} title - The info box title.
     * @param {string} body - The info box contents.
     */
    function updateInfoBox(title, body) {
        $(".message").css("display", "");
        $(".message-header").children("p").html(title);
        $(".message-body").html(body);
        
        // Setting up listener for dismissing message
        $("#notification-delete").on("click", function () {
            $(".message").css("display", "none");
        })
    }

    /**
     * Convert a pitch name (a-g) to a number (where c is 1, d is 2 and b is 7).
     * @param {string} pname - The pitch name.
     * @returns {number}
     */
    function pitchNameToNum(pname) {
        switch(pname) {
            case "c":
                return 1;
            case "d":
                return 2;
            case "e":
                return 3;
            case "f":
                return 4;
            case "g":
                return 5;
            case "a":
                return 6;
            case "b":
                return 7;
            default:
                console.log("Unknown pitch name");
        }
    }

    /**
     * Find the contour of an neume grouping based on the grouping name.
     * @param {string} value - the value name. 
     */
    function getContourByValue(value) {
        for (let [cont, v] of neumeGroups.entries()) {
            if (v === value){
                return cont;
            }
        }   
    }

    /**
     * A map containing neume groupings and their contours.
     */
    var neumeGroups = new Map (
        [["", "Punctum"], ["u", "Pes"], ["d", "Clivis"], ["uu", "Scandicus"], ["ud", "Torculus"], ["du", "Porrectus"],
         ["sd", "Pressus"], ["dd", "Climacus"], ["ddu", "Climacus resupinus"], ["udu", "Torculus resupinus"], ["dud", "Porrectus flexus"],
         ["udd", "Pes subpunctis"], ["uud", "Scandicus flexus"], ["uudd", "Scandicus subpunctis"], ["dudd", "Porrectus subpunctis"]]
    );

    InfoBox.prototype.infoListeners = infoListeners;
    InfoBox.getContour = getContour;
    InfoBox.getContourByValue = getContourByValue;
}
export {InfoBox as default};
