function DragController (neon, vrvToolkit) {
    var id = "";
    var dragStartCoords;
    var dragEndCoords;
    var canvas = d3.select("#svg_output");

    function dragInit () {
        // Adding listeners
        //var neumeComponents = d3.selectAll(".nc");
        var neumes = d3.selectAll(".neume");
        var clefs = d3.selectAll(".clef")
        var custos = d3.selectAll(".custos");

        neumes.call(
            d3.drag()
                .on("start", dragStarted)
                .on("drag", dragging)
                .on("end", dragEndedRelative)
        );

        clefs.call(
            d3.drag()
                .on("start", dragStarted)
                .on("drag", dragging)
                .on("end", dragEndedRelativeY)
        );

        custos.call(
            d3.drag()
                .on("start", dragStarted)
                .on("drag", dragging)
                .on("end", dragEnded)
        );
    
        var editorAction;
    
        // Drag effects
        function dragStarted () {
            id = this.id;

            // Highlighting
            d3.select(this).attr("fill", "#d00");
            
            dragStartCoords = [d3.event.x, d3.event.y, d3.event.sourceEvent.x];
        }
        function dragging () {
            var relativeY = d3.event.y - dragStartCoords[1];
            var relativeX = d3.event.x - dragStartCoords[0];

            d3.select(this).attr("transform", function(d,i) {
                return "translate(" + [relativeX, relativeY] + ")"
            })


        }
        function dragEnded () {
            dragEndCoords = [d3.event.x, d3.event.y, d3.event.sourceEvent.x];

            editorAction = { action: 'drag', param: { elementId: id, 
                // TODO: Investigate X offset L M A O
                x: parseInt(dragStartCoords[2] - 20 + (dragEndCoords[2] - dragStartCoords[2])),
                // TODO: Investigate Y offset
                y: parseInt(dragStartCoords[1] + 750 + (dragEndCoords[1] - dragStartCoords[1])) }   
            };
           
            vrvToolkit.edit(editorAction);
            neon.refreshPage();
            neumeInformation(id);
            dragInit();
        }

        function dragEndedRelative () {
            dragEndCoords = [d3.event.x, d3.event.y, d3.event.sourceEvent.x];

            editorAction = {action: 'drag', param: { elementId: id,
                x: parseInt(dragStartCoords[2] - dragEndCoords[2]),
                y: parseInt(dragStartCoords[1] - dragEndCoords[1]) }
            };

            vrvToolkit.edit(editorAction);
            neon.refreshPage();
            neumeInformation(id);
            dragInit();
        }

        function dragEndedRelativeY () {
            dragEndCoords = [d3.event.x, d3.event.y, d3.event.sourceEvent.x];

            editorAction = { action: 'drag', param: { elementId: id,
                x: parseInt(dragStartCoords[2] - 20 + (dragEndCoords[2] - dragStartCoords[2])),
                y: parseInt(dragStartCoords[1] - dragEndCoords[1]) }
            };
            
            vrvToolkit.edit(editorAction);
            neon.refreshPage();
            neumeInformation(id);
            dragInit();
        }
    }


    // This function updates the neume information box in the editor
    // TODO: Separate this functionality into its own file
    function neumeInformation(id) {
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
                var ncs = element.selectAll('.nc');
                var pitches = [];
                ncs.each( function () {
                    var ncId = d3.select(this).attr("id");
                    var ncPitch = vrvToolkit.getElementAttr(ncId).pname;
                    pitches.push(ncPitch);
                })
                // TODO: Somehow get the grouping name from verovio? Requires quite a bit of refactoring in verovio for this though
                body += "Pitch(es): " + pitches;
                break;
            case "custos":
                body += "Pitch: " + vrvToolkit.getElementAttr(id).pname;
                break;
            default:
                body += "nothing";
                break;
        }

        // Resetting info box then adding relevant info
        $("#neume_info").empty();
        $("#neume_info").append(
            "<article class='message'>" +
            "<div class='message-header'> <p>" + elementClass + "</p> <button id='notification-delete' class='delete' aria-label='delete'></button> </div>" +
            "<div class='message-body'>" + body + "</div> </article>"
        );

        // Setting up listener for dismissing message
        $("#notification-delete").on("click", function() {
            $("#neume_info").empty();
        })
    }

    DragController.prototype.dragInit = dragInit;
}
