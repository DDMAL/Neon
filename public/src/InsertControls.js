function InsertControls (neon) {
    // set up listeners to switch between tabs and load the appropriate template
    $("#neumeTab").on("click", function(){
        deactivate(".insertTab");
        activate(this.id);
        resetCursor();
        $("#insert_data").empty();
        $("#insert_data").append(
            "<p class='control'>" +
            "<button id='punctum' class='button insertel'><img src='/img/punctum.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='virga' class='button insertel'><img src='/img/virga.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='diamond' class='button insertel'><img src='/img/diamond.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='white_punct' class='button insertel'><img src='/img/white_punct.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='quilisma' class='button insertel'><img src='/img/quilisma.png' class='image'/></button></p>" +
            "<p class='control'>" +
            "<button id='custos' class='button insertel'><img src='/img/custos.png' class='image'/></button></p>"
        );

        bindElements();
    });

    $("#clefTab").on("click", function(){
        deactivate(".insertTab");
        activate(this.id);
        resetCursor();
        $("#insert_data").empty();
        $("#insert_data").append(
            "<p class='control'>" +
            "<button id='cClef' class='button insertel'><img src='/img/cClef.png' class='image' /></button></p>" +
            "<p class='control'>" +
            "<button id='fClef' class='button insertel'><img src='/img/fClef.png' class='image'/></button></p>"
        );
        
        bindElements();
    });

    $("#systemTab").on("click", function(){
        deactivate(".insertTab");
        activate(this.id);
        resetCursor();
        $("#insert_data").empty();
        $("#insert_data").append(
            "<p class='control'>" +
            "<button id='staff' class='button insertelLong'><img src='/img/staff.png' class='image' /></button></p>" +
            "<input id='staffSlider' class='slider is-fullwidth' min='10' max='100' value='50' step='1' type='range'/>" +
            "<output for='staffSlider'>100</output>"
        );
        //ToDo: Dynamic system output, bind elements, add scaled staff as cursor
    });

    $("#divisionTab").on("click", function(){
        deactivate(".insertTab");
        activate(this.id);
        resetCursor();
        $("#insert_data").empty();
        $("#insert_data").append(
            "<p class='control'>" +
            "<button id='smallDiv' class='button insertelLong'>Small</button></p>" +
            "<p class='control'>" +
            "<button id='minorDiv' class='button insertelLong'>Minor</button></p>" +
            "<p class='control'>" +
            "<button id='majorDiv' class='button insertelLong'>Major</button></p>" +
            "<p class='control'>" +
            "<button id='finalDiv' class='button insertelLong'>Final</button></p>"
        );
        //TODO: add division images
    });

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
        //TODO: add division images for buttons and cursor image
    }

    function bindElements() {
        var insertElements = d3.selectAll('.insertEl')._groups[0];
        var elementIds = $.map(insertElements, function(el, i){
            return el.id;
        });

        $.each(elementIds, function(i, el){
            $('#' + el).on("click", function(){
                deactivate(".insertel");
                activate(el);  
                updateCursor(el);
            });
        });
    }

    function updateCursor(id) {
        var url = 'url(/img/' + id + '.png), auto';
        $("#bgimg").css('cursor', url);
        $("#mei_output").css('cursor', url);
    }

    function resetCursor(id) {
        $("#bgimg").css('cursor', "default");
        $("#mei_output").css('cursor', "default");
    }
  
    // Default to neume tab on initial load
    $("#neumeTab").click();
    
    Neon.prototype.deactivate = deactivate;
    Neon.prototype.activate = activate;
    Neon.prototype.bindElements = bindElements;
    Neon.prototype.updateCursor = updateCursor;
    Neon.prototype.resetCursor = resetCursor;

}