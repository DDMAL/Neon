export default function GroupingHandler (neonView) {
    //TODO: CHANGE NAVABAR-LINK TO PROPER ICON//
    function triggerGroupSelection () {
        $("#moreEdit").removeClass("is-invisible");
        var groupMethod = ($("#selByNeume").hasClass("is-active") ? "Group as Syllable" : "Group as Neume");
        $("#moreEdit").append(
            "<div class='field is-grouped'>" +
            "<div><p class='control'>" +
            "<button class='button' id='group'>" + groupMethod + "</button></p></div>" +
            "<div><p class='control'>" +
            "<button class='button' id='ungroup'>Ungroup</button></p></div>"
        );
        
        initGroupingListeners();
    };

    function endGroupingSelection () {
        $("#moreEdit").empty();
        $("#moreEdit").addClass("is-invisible");
    }

    function initGroupingListeners(){
        $("#grouping_dropdown").on("click", function() {
            $(this).toggleClass("is-active");
        })

        $("#group").on("click", function(){
            groupingAction("group");
        })

        $("#ungroup").on("click", function(){
            groupingAction("ungroup");
        })

    }
    
    function groupingAction(action) {
        var elementIds = [];
        var elements = Array.from($(".selected"));

        elements.every((el) => {
            var groupEls = ($("#selByNeume").hasClass("is-active") ? "neume" : "nc");
            console.log(groupEls)
            if ($(el).hasClass(groupEls)){
                elementIds.push(el.id);
            }
            else {
                elementIds = [];
                console.log("Error: cannot group Clefs or Custos");
                return false;
            }
            return true;
        })

        let editorAction = {
            "action": action,
            "param": {
                "groupType" : groupEls,
                "elementIds": elementIds
            }
        };

        neonView.edit(editorAction);
        neonView.refreshPage();
    }
    
    GroupingHandler.prototype.constructor = GroupingHandler;
    GroupingHandler.prototype.triggerGroupSelection = triggerGroupSelection;
    GroupingHandler.prototype.endGroupingSelection = endGroupingSelection;
}