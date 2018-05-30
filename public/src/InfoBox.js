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
        updateInfo(this.parentNode.id);
    }

    // This function updates the neume information box in the editor
    function updateInfo(id) {
        if (id == "") {
            $("#neume_info").empty();
            console.log("No id!");
            return;
        }

        var element = d3.select("#" + id);
        var elementClass = element.attr("class");
        var body = "";

        // Information displayed depends on class
        switch(elementClass) {
            case "neume":
                var childPitches = vrvToolkit.getElementChildPitches(id);
                var contour = "";
                var pitches = "";
                var previous = null;

                // Iterate through pitches for each neume component
                // These may not match how the nc element SVGs are
                // rendered because of how we handle different neume
                // groupings in verovio.
                Object.keys(childPitches).forEach( function (key) {
                    var current = childPitches[key];
                    pitches += pitchNumToName(current.pname) + current.oct + " ";
                    if (previous !== null) {
                        // Calculate the contour of the neume
                        if (previous.oct > current.oct) {
                            contour += "d";
                        }
                        else if (previous.oct < current.oct) {
                            contour += "u";
                        }
                        else {
                            if (previous.pname > current.pname) {
                                contour += "u";
                            }
                            else if (previous.pname < current.pname) {
                                contour += "d";
                            }
                            else {
                                contour += "s";
                            }
                        }
                    }
                    previous = current;
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

    // Converts the value of data_PITCHNAME in verovio
    // to the actual letter for the pitch
    function pitchNumToName(pitchNumber) {
        switch(parseInt(pitchNumber)) {
            case 1:
                return "c";
            case 2:
                return "d";
            case 3:
                return "e";
            case 4:
                return "f";
            case 5:
                return "g";
            case 6:
                return "a";
            case 7:
                return "b";
            default:
                console.log(pitchNumber);
                return "";
        }
    }

    // Identical to map used for groupings in vrv::Neume
    var neumeGroups = new Map (
        [["", "Punctum"], ["u", "Pes"], ["d", "Clivis"], ["uu", "Scandicus"], ["dd", "Climacus"], ["ud", "Torculus"], ["du", "Porrectus"],
         ["sd", "Pressus"], ["ddd", "Climacus"], ["ddu", "Climacus resupinus"], ["udu", "Torculus resupinus"], ["dud", "Porrectus flexus"],
         ["udd", "Pes subpunctis"], ["uud", "Scandicus flexus"], ["uudd", "Scandicus subpunctis"], ["dudd", "Porrectus subpunctis"]]
    );

    InfoBox.prototype.infoListeners = infoListeners;
}
