export default function InsertControls (cursorHandler, insertHandler) {
    // To add new tab, add inner html to dictionary with id as key value. All elements must be of class insertel.
    var tabHtml = {
        neumeTab: "<p class='control'>" +
            "<button id='punctum' class='button insertel smallel' title='punctum'><img src='/img/punctum.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='virga' class='button insertel smallel' title='virga'><img src='/img/virga.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='diamond' class='button insertel smallel' title='inclinatum'><img src='/img/diamond.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='white_punct' class='button insertel smallel' title='white punctum'><img src='/img/white_punct.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='quilisma' class='button insertel smallel' title='quilisma'><img src='/img/quilisma.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='custos' class='button insertel smallel' title='custos'><img src='/img/custos.png' class='image'/></button></p>",
        groupingTab: "<p class='control'>" +
            "<button id='torculus' class='button insertel smallel' title='torculus'><img src='' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='clivis' class='button insertel smallel' title='clivis'><img src='' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='pes' class='button insertel smallel' title='pes'><img src='' class='image'/></button></p>",
        clefTab: "<p class='control'>" +
            "<button id='cClef' class='button insertel smallel' title=' C Clef'><img src='/img/cClef.png' class='image' /></button></p>" +
            "<p class='control'>" +
            "<button id='fClef' class='button insertel smallel' title='F Clef'><img src='/img/fClef.png' class='image'/></button></p>",
        systemTab: "<p class='control'>" +
            "<button id='staff' class='button insertel longel' title='system'><img src='/img/staff.png' class='image' /></button></p>" +
            "<input id='staffSlider' class='slider is-fullwidth' min='10' max='100' value='50' step='1' type='range'/>" +
            "<output for='staffSlider'>100</output>",
        divisionTab: "<p class='control'>" +
            "<button id='smallDiv' class='button insertel tallel'><img src='/img/smallDiv.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='minorDiv' class='button insertel tallel'><img src='/img/minorDiv.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='majorDiv' class='button insertel tallel'><img src='/img/majorDiv.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='finalDiv' class='button insertel tallel'><img src='/img/finalDiv.png' class='image'/></button></p>"
    }

    bindTabs();
    // Default to neume tab on initial load
    $("#neumeTab").click();
    
    function bindTabs() {
        var insertTabs = d3.selectAll('.insertTab')._groups[0];
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
        var insertElements = d3.selectAll('.insertel')._groups[0];
        var elementIds = $.map(insertElements, function(el, i){
            return el.id;
        });
        $.each(elementIds, function(i, el){
            $('#' + el).on('click', function(){
                deactivate('.insertel');
                activate(el);  
                cursorHandler.updateCursor(el);
            });
        });
    }

    function activate(id) {
        $("#" + id)[0].classList.add('is-active');
        insertHandler.insertActive(id);
    }

    function deactivate(type) {
        var elList = d3.selectAll(type)._groups[0];
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
