export default function GroupingHandler (neonView) {

    //TODO: CHANGE NAVABAR-LINK TO PROPER ICON//
    function triggerGroupSelection () {
        $("#moreEdit").removeClass("is-invisible");
        $("#moreEdit").append(
            "<label>Select Grouping:&nbsp;</label>" +
            "<div id='grouping_dropdown' class='dropdown'>" +
            "<div class='dropdown-trigger'>" +
            "<button id='select-options' class='button navbar-link' aria-haspopup='true' aria-controls='dropdown-menu'>" +
            "<span>Groupings</span><span class='icon is-small'>" +
            "<i class=''></i></span></button></div>" +
            "<div class='dropdown-menu' id='dropdown-menu' role='menu'>" +
            "<div class='dropdown-content'>" +
            "<a id='grouping' class='dropdown-item'>Torculus</a>" +
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

        $("#grouping").on("click", function(){
            groupNcs();
        })

        $("#ungroup").on("click", function(){
            ungroupNcs();
        })

    }
    
    function groupNcs() {
        var elementIds = [];
        var elements = Array.from($(".selected"));

        elements.every((el) => {
            if ($(el).hasClass("nc")){
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
            "action": "group",
            "param": {
                "elementIds": elementIds
            }
        };

        function ungroupNcs() {
            
        }

        neonView.edit(editorAction);
        neonView.refreshPage();
    }
    
    GroupingHandler.prototype.constructor = GroupingHandler;
    GroupingHandler.prototype.triggerGroupSelection = triggerGroupSelection;
    GroupingHandler.prototype.endGroupingSelection = endGroupingSelection;
}