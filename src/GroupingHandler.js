export default function GroupingHandler () {

    function triggerGroupSelection () {
        $("#moreEdit").removeClass("is-invisible");
        $("#moreEdit").append(
            "<label>Select Grouping:&nbsp;</label>" +
            "<div id='grouping_dropdown' class='dropdown'>" +
            "<div class='dropdown-trigger'>" +
            "<button id='select-options' class='button' aria-haspopup='true' aria-controls='dropdown-menu'>" +
            "<span>Groupings</span><span class='icon is-small'>" +
            "<i class=''></i></span></button></div>" +
            "<div class='dropdown-menu' id='dropdown-menu' role='menu'>" +
            "<div class='dropdown-content'>" +
            "<a id='Torculus' class='dropdown-item'>Torculus</a>" +
            "<a id='' class='dropdown-item'>Etc...</a></div></div></div>" +
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