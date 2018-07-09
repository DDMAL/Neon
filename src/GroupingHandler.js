export default function GroupingHandler () {

    function triggerGroupSelection () {
        $("#moreEdit").append(
            "<a class='panel-block'>" +
            "<div class='dropdown is-active'>" +
            "<div class='dropdown-trigger'>" +
            "<button class='button' aria-haspopup='true' aria-controls='dropdown-menu'>" +
            "<span>Groupings</span><span class='icon is-small'>" +
            "<i class='fa-angle-down'></i></span></button></div>" +
            "<div class='dropdown-menu' id='dropdown-menu' role='menu'>" +
            "<div class='dropdown-content'></div></div></div></a>"
        );
    };

    GroupingHandler.prototype.constructor = GroupingHandler;
    GroupingHandler.prototype.triggerGroupSelection = triggerGroupSelection;
}