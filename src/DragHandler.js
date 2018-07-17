export default function DragHandler (neonView) {
    var dragStartCoords;
    var dragEndCoords;

    function dragInit () {
        // Adding listeners
        var activeNc = d3.selectAll(".selected");
        var selection = Array.from(activeNc._groups[0]);
        
        dragStartCoords = new Array(activeNc.length);
        dragEndCoords = new Array(activeNc.length);

        activeNc.call(
            d3.drag()
                .on("start", dragStarted)
                .on("drag", dragging)
                .on("end", dragEnded)
        );

        var editorAction;
    
        // Drag effects
        function dragStarted () {
            dragStartCoords = d3.mouse(this);
        }

        function dragging () {
            var relativeY = d3.event.y - dragStartCoords[1];
            var relativeX = d3.event.x - dragStartCoords[0];

            selection.forEach((el) => {
                d3.select(el).attr("transform", function() {
                    return "translate(" + [relativeX, relativeY] + ")"
                })
            })
        }

        function dragEnded () {
            dragEndCoords = [d3.event.x, d3.event.y];
            let paramArray = [];
            selection.forEach((el) => {
                let singleAction = { action: 'drag', param: { elementId: el.id, 
                    x: parseInt(dragEndCoords[0] - dragStartCoords[0]),
                    y: parseInt(dragEndCoords[1] - dragStartCoords[1]) * -1}
                };
                paramArray.push(singleAction);
            });
            editorAction = {
                "action": "chain",
                "param": paramArray
            };
            console.log(editorAction);
            neonView.edit(editorAction);
            neonView.refreshPage();
            dragInit();
            endOptionsSelection();
        }
    }

    function endOptionsSelection () {
        $("#moreEdit").empty();
        $("#moreEdit").addClass("is-invisible");
    }

    DragHandler.prototype.dragInit = dragInit;
}
