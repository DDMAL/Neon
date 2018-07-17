import PunctumIcon from "./img/punctum.png";
import VirgaIcon from "./img/virga.png";
import DiamondIcon from "./img/diamond.png";
import WhitePunctumIcon from "./img/white_punct.png";
import QuilismaIcon from "./img/quilisma.png";
import CustosIcon from "./img/custos.png";
import CClefIcon from "./img/cClef.png";
import FClefIcon from "./img/fClef.png";
import StaffIcon from "./img/staff.png";
import SmallDivIcon from "./img/smallDiv.png";
import MinorDivIcon from "./img/minorDiv.png";
import MajorDivIcon from "./img/majorDiv.png";
import FinalDivIcon from "./img/finalDiv.png";

export default function InsertControls (cursorHandler, insertHandler) {
    // To add new tab, add inner html to dictionary with id as key value. All elements must be of class insertel.
    var tabHtml = {
        neumeTab: "<p class='control'>" +
            "<button id='punctum' class='button insertel smallel' title='punctum'><img src='/" + PunctumIcon + "' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='virga' class='button insertel smallel' title='virga'><img src='/" + VirgaIcon + "' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='diamond' class='button insertel smallel' title='inclinatum'><img src='/" + DiamondIcon + "' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='white_punct' class='button insertel smallel' title='white punctum'><img src='/" + WhitePunctumIcon + "' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='quilisma' class='button insertel smallel' title='quilisma'><img src='/" + QuilismaIcon + "' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='custos' class='button insertel smallel' title='custos'><img src='/" + CustosIcon + "' class='image'/></button></p>",
        groupingTab: "<p class='control'>" +
            "<button id='torculus' class='button insertel smallel' title='torculus'><img src='' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='clivis' class='button insertel smallel' title='clivis'><img src='' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='pes' class='button insertel smallel' title='pes'><img src='' class='image'/></button></p>",
        clefTab: "<p class='control'>" +
            "<button id='cClef' class='button insertel smallel' title=' C Clef'><img src='/" + CClefIcon + "' class='image' /></button></p>" +
            "<p class='control'>" +
            "<button id='fClef' class='button insertel smallel' title='F Clef'><img src='/" + FClefIcon + "' class='image'/></button></p>",
        systemTab: "<p class='control'>" +
            "<button id='staff' class='button insertel longel' title='system'><img src='/" + StaffIcon + "' class='image' /></button></p>", 
        divisionTab: "<p class='control'>" +
            "<button id='smallDiv' class='button insertel tallel'><img src='/" + SmallDivIcon + "' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='minorDiv' class='button insertel tallel'><img src='/" + MinorDivIcon +"' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='majorDiv' class='button insertel tallel'><img src='/" + MajorDivIcon + "' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='finalDiv' class='button insertel tallel'><img src='/" + FinalDivIcon + "' class='image'/></button></p>"
    }

    bindTabs();
    // Default to neume tab on initial load
    $("#neumeTab").click();
    
    function bindTabs() {
        var insertTabs = $('.insertTab');
        var tabIds = $.map(insertTabs, function(tab, i){
            return tab.id;
        });
        $.each(tabIds, function(i, tab){
            $('#' + tab).on('click', function(){
                deactivate('.insertTab');
                activate(this.id);
                cursorHandler.resetCursor();
                $("#insert_data").empty();
                $("#insert_data").append(tabHtml[tab]);
                bindElements();
            })
        })
    }

    function bindElements() {
        var insertElements = $('.insertel');
        var elementIds = $.map(insertElements, function(el, i){
            return el.id;
        });
        $.each(elementIds, function(i, el){
            $('#' + el).on('click', function(){
                deactivate('.insertel');
                activate(el);  
                cursorHandler.updateCursor();
            });
        });
    }

    function activate(id) {
        $("#" + id)[0].classList.add('is-active');
        insertHandler.insertActive(id);
    }

    function deactivate(type) {
        var elList = $(type);
        for (var i=0; i<elList.length; i++){
            if(elList[i].classList.length > 1){
                elList[i].classList.remove('is-active');
            }
        }
    }
    
    InsertControls.prototype.constructor = InsertControls;
    InsertControls.prototype.bindTabs = bindTabs;
    InsertControls.prototype.bindElements = bindElements;
    InsertControls.prototype.deactivate = deactivate;
    InsertControls.prototype.activate = activate;
}
