export default function SelectOptions(neonView) {
    //TODO: CHANGE NAVABAR-LINK TO PROPER ICON//
    function triggerNcActions(lastSelect) {
        endOptionsSelection();
        $("#moreEdit").removeClass("is-invisible");
        $("#moreEdit").append(
            "<label>Change Head Shape:&nbsp;</label>" +
            "<div id='drop_select' class='dropdown'>" +
            "<div class='dropdown-trigger'>" +
            "<button id='select-options' class='button navbar-link' aria-haspopup='true' aria-controls='dropdown-menu'>" +
            "<span>Head Shapes</span><span class='icon is-small'>" +
            "<i class=''></i></span></button></div>" +
            "<div class='dropdown-menu' id='dropdown-menu' role='menu'>" +
            "<div class='dropdown-content'>" +
            "<a id='Punctum' class='dropdown-item'>Punctum</a>" +
            "<a id='Virga' class='dropdown-item'>Virga</a>" +
            "<a id='Inclinatum' class='dropdown-item'>Inclinatum</a></div></div></div>"
        );
        
        $("#Punctum.dropdown-item").on("click", (evt) => {
            let unsetInclinatum = {
                "action": "set",
                "param": {
                    "elementId": lastSelect[0].id,
                    "attrType": "name",
                    "attrValue": ""
                }
            };
            let unsetVirga = {
                "action": "set",
                "param": {
                    "elementId": lastSelect[0].id,
                    "attrType": "diagonalright",
                    "attrValue": ""
                }
            };
            neonView.edit({ "action": "chain", "param": [ unsetInclinatum, unsetVirga ]});
            neonView.refreshPage();
        });

        $("#Inclinatum.dropdown-item").on("click", (evt) => {
            let setInclinatum = {
                "action": "set",
                "param": {
                    "elementId": lastSelect[0].id,
                    "attrType": "name",
                    "attrValue": "inclinatum"
                }
            };
            let unsetVirga = {
                "action": "set",
                "param": {
                    "elementId": lastSelect[0].id,
                    "attrType": "diagonalright",
                    "attrValue": ""
                }
            };
            neonView.edit({ "action": "chain", "param": [ setInclinatum, unsetVirga ]});
            neonView.refreshPage();
        });
        
        $("#Virga.dropdown-item").on("click", (evt) => {
            let unsetInclinatum = {
                "action": "set",
                "param": {
                    "elementId": lastSelect[0].id,
                    "attrType": "name",
                    "attrValue": ""
                }
            };
            let setVirga = {
                "action": "set",
                "param": {
                    "elementId": lastSelect[0].id,
                    "attrType": "diagonalright",
                    "attrValue": "u"
                }
            };
            neonView.edit({ "action": "chain", "param": [ unsetInclinatum, setVirga ]});
            neonView.refreshPage();
        });

        initOptionsListeners();
    }
    //TODO: CHANGE NAVABAR-LINK TO PROPER ICON//
    function triggerNeumeActions() {
        endOptionsSelection()
        $("#moreEdit").removeClass("is-invisible");
        $("#moreEdit").append(
            "<label>Change Grouping:&nbsp;</label>" +
            "<div id='drop_select' class='dropdown'>" +
            "<div class='dropdown-trigger'>" +
            "<button id='select-options' class='button navbar-link' aria-haspopup='true' aria-controls='dropdown-menu'>" +
            "<span>Groupings</span><span class='icon is-small'>" +
            "<i class=''></i></span></button></div>" +
            "<div class='dropdown-menu' id='dropdown-menu' role='menu'>" +
            "<div class='dropdown-content'>" +
            "<a id='Torculus' class='dropdown-item'>Torculus</a></div></div></div>" +
            "<div><p class='control'>" +
            "<button class='button' id='ungroup'>Ungroup</button></p></div>"
        );

        initOptionsListeners();
    }

    function endOptionsSelection () {
        $("#moreEdit").empty();
        $("#moreEdit").addClass("is-invisible");
    }

    function initOptionsListeners(){
        $("#drop_select").on("click", function() {
            $(this).toggleClass("is-active");
        })
    }

    SelectOptions.prototype.constructor = SelectOptions;
    SelectOptions.prototype.triggerNcActions = triggerNcActions;
    SelectOptions.prototype.triggerNeumeActions = triggerNeumeActions;
};