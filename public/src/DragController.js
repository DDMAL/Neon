function DragController (neon, vrvToolkit) {
    var id = "";
    var dragStartCoords;
    var dragEndCoords;
    var canvas = d3.select("#svg_output");
    var infoController = new InfoController(vrvToolkit);

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
            infoController.updateInfo(id);
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
            infoController.updateInfo(id);
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
            infoController.updateInfo(id);
            dragInit();
        }
    }

    DragController.prototype.dragInit = dragInit;
}
