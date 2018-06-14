function InfoBox(vrvToolkit) {

    function infoListeners() {
        var neumes = d3.selectAll(".neume");
        var custos = d3.selectAll(".custos");
        var clefs = d3.selectAll(".clef");

        neumes.call( d3.drag().on("start", setInfo) );
        custos.call( d3.drag().on("start", setInfo) );
        clefs.call( d3.drag().on("start", setInfoClef) );
    }

    function setInfo() {
        updateInfo(this.id);
    }

    function setInfoClef() {
        if (vrvToolkit.getElementAttr(this.id).shape !== undefined) {
            updateInfo(this.id);
        }
        else {
            updateInfo(this.parentNode.id);
        }
    }

    // This function updates the neume information box in the editor
    function updateInfo(id) {
        // For now, since Clefs do not have their own element tag in mei4, there is not a way to select the <g> element
        // So we will simply return if ID does not exist for now
        if (id == "") {
            $("#neume_info").empty();
            console.log("No id!");
            return;
        }

        var element = d3.select("#" + id);
        var elementClass = element.attr("class");
        var body = "";

        // Gets the pitches depending on element type and 
        switch(elementClass) {
            case "neume":
                // Select neume components of selected neume
                var ncs = element.selectAll(".nc");
                var contour = "";
                var pitches = "";
                var previous = null;
                ncs.each( function () {
                    var attributes = vrvToolkit.getElementAttr(this.id);
                    pitches += attributes.pname + attributes.oct + " ";
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
                pitches = pitches.trim().toUpperCase();
                body = "Shape: " + neumeGroups.get(contour) + "<br/>"
                    + "Pitch(es): " + pitches;
                break;
            case "custos":
                var attributes = vrvToolkit.getElementAttr(id);
                body += "Pitch: " + (attributes.pname).toUpperCase() + attributes.oct;
                break;
            case "clef":
                var attributes = vrvToolkit.getElementAttr(id);
                body += "Shape: " + attributes.shape + "<br/>"
                    + "Line: " + attributes.line;
                break;
            case "staff":
                elementClass = "clef";
                var staffDefAttributes = vrvToolkit.getElementStaffDef(id);
                body = "Shape: " + staffDefAttributes["clef.shape"] + "<br/>"
                    + "Line: " + staffDefAttributes["clef.line"];
                break;
            default:
                body += "nothing";
                break;
        }
        updateInfoBox(elementClass, body);
    }
    
    function updateInfoBox(title, body) {
        $("#neume_info").empty();
        $("#neume_info").append(
            "<article class='message'>" +
            "<div class='message-header'> <p>" + title + "</p> <button id='notification-delete' class='delete' aria-label='delete'></button> </div>" +
            "<div class='message-body'>" + body + "</div> </article>"
        );

        // Setting up listener for dismissing message
        $("#notification-delete").on("click", function () {
            $("#neume_info").empty();
        })
    }

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

    var neumeGroups = new Map (
        [["", "Punctum"], ["u", "Pes"], ["d", "Clivis"], ["uu", "Scandicus"], ["dd", "Climacus"], ["ud", "Torculus"], ["du", "Porrectus"],
         ["sd", "Pressus"], ["ddd", "Climacus"], ["ddu", "Climacus resupinus"], ["udu", "Torculus resupinus"], ["dud", "Porrectus flexus"],
         ["udd", "Pes subpunctis"], ["uud", "Scandicus flexus"], ["uudd", "Scandicus subpunctis"], ["dudd", "Porrectus subpunctis"]]
    );

    InfoBox.prototype.infoListeners = infoListeners;
}
