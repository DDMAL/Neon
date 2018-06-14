function InsertControls (neon) {
    // To add new tab, add inner html to dictionary with id as key value. All elements must be of class insertel.
    var tabHtml = {
        neumeTab: "<p class='control'>" +
            "<button id='punctum' class='button insertel smallel'><img src='/img/punctum.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='virga' class='button insertel smallel'><img src='/img/virga.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='diamond' class='button insertel smallel'><img src='/img/diamond.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='white_punct' class='button insertel smallel'><img src='/img/white_punct.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='quilisma' class='button insertel smallel'><img src='/img/quilisma.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='custos' class='button insertel smallel'><img src='/img/custos.png' class='image'/></button></p>",
        clefTab: "<p class='control'>" +
            "<button id='cClef' class='button insertel smallel'><img src='/img/cClef.png' class='image' /></button></p>" +
            "<p class='control'>" +
            "<button id='fClef' class='button insertel smallel'><img src='/img/fClef.png' class='image'/></button></p>",
        systemTab: "<p class='control'>" +
            "<button id='staff' class='button insertel longel'><img src='/img/staff.png' class='image' /></button></p>" +
            "<input id='staffSlider' class='slider is-fullwidth' min='10' max='100' value='50' step='1' type='range'/>" +
            "<output for='staffSlider'>100</output>",
        divisionTab: "<p class='control'>" +
            "<button id='smallDiv' class='button insertel longel'>Small</button></p>" +
            "<p class='control'>" +
            "<button id='minorDiv' class='button insertel longel'>Minor</button></p>" +
            "<p class='control'>" +
            "<button id='majorDiv' class='button insertel longel'>Major</button></p>" +
            "<p class='control'>" +
            "<button id='finalDiv' class='button insertel longel'>Final</button></p>"
    }

    bindTabs();
    
    function bindTabs() {
        var insertTabs = d3.selectAll('.insertTab')._groups[0];
        var tabIds = $.map(insertTabs, function(tab, i){
            return tab.id;
        });
        $.each(tabIds, function(i, tab){
            $('#' + tab).on('click', function(){
                deactivate('.insertTab');
                activate(this.id);
                resetCursor();
                $("#insert_data"). empty();
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
                updateCursor(el);
            });
        });
    }

    function activate(id) {
        $("#" + id)[0].classList.add('is-active');
    }

    function deactivate(type) {
        var elList = d3.selectAll(type)._groups[0];
        for (i=0; i<elList.length; i++){
            if(elList[i].classList.length > 1){
                elList[i].classList.remove('is-active');
            }
        }
    }

    function updateCursor(id) {
        var url = 'url(/img/' + id + '.png), auto';
        $("#bgimg").css('cursor', url);
        $("#mei_output").css('cursor', url);
    }

    function resetCursor(id) {
        $("#bgimg").css('cursor', 'default');
        $("#mei_output").css('cursor', 'default');
    }
  
    // Default to neume tab on initial load
    $("#neumeTab").click();
    
    Neon.prototype.bindTabs = bindTabs;
    Neon.prototype.bindElements = bindElements;
    Neon.prototype.deactivate = deactivate;
    Neon.prototype.activate = activate;
    Neon.prototype.updateCursor = updateCursor;
    Neon.prototype.resetCursor = resetCursor;
}