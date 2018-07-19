export default function GroupingHandler (neonView) {
    //TODO: CHANGE NAVABAR-LINK TO PROPER ICON//
    function triggerGrouping (type) {
        $("#moreEdit").removeClass("is-invisible");
        if(type == "nc"){
            $("#moreEdit").append(
                "<div class='field is-grouped'>" +
                "<div><p class='control'>" +
                "<button class='button' id='groupNcs'>Group Ncs</button></p></div>"
            );
        }
        else if(type == "neume"){
            $("#moreEdit").append(
                "<div class='field is-grouped'>" +
                "<div><p class='control'>" +
                "<button class='button' id='groupNeumes'>Group Neumes</button></p></div>" +
                "<div><p class='control'>" +
                "<button class='button' id='ungroupNcs'>Ungroup</button></p></div></div>"
            );
        }
        else if(type == "syl"){
            $("#moreEdit").append(
                "<div class='field is-grouped'>" +
                "<div><p class='control'>" +
                "<button class='button' id='mergeSyls'>Merge Syllables</button></p></div>" +
                "<div><p class='control'>" +
                "<button class='button' id='ungroupNeumes'>Ungroup</button></p></div></div>"
            );
        }
        initGroupingListeners();
    };

    function endGroupingSelection () {
        $("#moreEdit").empty();
        $("#moreEdit").addClass("is-invisible");
    }

    function initGroupingListeners(){
        $("#mergeSyls").on("click", function(){
            var elementIds = getChildrenIds();
            groupingAction("group", "neume", elementIds);
        })
        $("#groupNeumes").on("click", function(){
            var elementIds = getIds();
            groupingAction("group", "neume", elementIds);
        })

        $("#groupNcs").on("click", function() {
            var elementIds = getIds();
            groupingAction("group", "nc", elementIds);
        })

        $("#ungroupNeumes").on("click", function(){
            var elementIds = getChildrenIds();
            groupingAction("ungroup", "neume", elementIds);
        })
        $("#ungroupNcs").on("click", function() {
            var elementIds = getChildrenIds();
            groupingAction("ungroup", "nc", elementIds);
        })
    }
    
    function groupingAction(action, groupType, elementIds) {
        let editorAction = {
            "action": action,
            "param": {
                "groupType" : groupType,
                "elementIds": elementIds
            }
        };

        neonView.edit(editorAction);
        neonView.refreshPage();
    }

    function getIds() {
        var ids = [];
        var elements = Array.from($(".selected"));
        elements.forEach(el => {
            ids.push($(el)[0].id);
        })
        return ids;
    }

    function getChildrenIds(){
        var childrenIds = [];
        var elements = Array.from($(".selected"));
        elements.forEach(el => {
            var children = Array.from($(el).children());
            children.forEach(ch => { 
                childrenIds.push($(ch)[0].id);
            })
        })
        return childrenIds;
    }
    
    GroupingHandler.prototype.constructor = GroupingHandler;
    GroupingHandler.prototype.initGroupingListeners = initGroupingListeners;
    GroupingHandler.prototype.triggerGrouping = triggerGrouping;
    GroupingHandler.prototype.endGroupingSelection = endGroupingSelection;
}