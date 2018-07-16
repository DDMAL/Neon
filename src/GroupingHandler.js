export default function GroupingHandler () {
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

    }
    
    GroupingHandler.prototype.constructor = GroupingHandler;
    GroupingHandler.prototype.triggerGroupSelection = triggerGroupSelection;
    GroupingHandler.prototype.endGroupingSelection = endGroupingSelection;
}