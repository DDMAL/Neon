function InfoController(vrvToolkit) {

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
                var childPitches = vrvToolkit.getElementChildPitches(id);
                var contour = "";
                var previous = null;
                Object.keys(childPitches).forEach( function (key) {
                    var current = childPitches[key];
                    body += pitchNumToName(current.pname) + current.oct + " ";
                    if (previous !== null) {
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
                body = neumeGroups.get(contour) + " " + body;
                break;
            case "custos":
                var attributes = vrvToolkit.getElementAttr(id);
                body += "Custos " + attributes.pname + attributes.oct;
                break;
            case "staff":
                elementClass = "clef";
                var staffDefAttributes = vrvToolkit.getElementStaffDef(id);
                body += staffDefAttributes["clef.shape"] + " clef line " + staffDefAttributes["clef.line"];
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

    var neumeGroups = new Map (
        [["", "Punctum"], ["u", "Pes"], ["d", "Clivis"], ["uu", "Scandicus"], ["dd", "Climacus"], ["ud", "Torculus"], ["du", "Porrectus"],
         ["sd", "Pressus"], ["ddd", "Climacus"], ["ddu", "Climacus resupinus"], ["udu", "Torculus resupinus"], ["dud", "Porrectus flexus"],
         ["udd", "Pes subpunctis"], ["uud", "Scandicus flexus"], ["uudd", "Scandicus subpunctis"], ["dudd", "Porrectus subpunctis"]]
    );

    InfoController.prototype.infoListeners = infoListeners;
}
