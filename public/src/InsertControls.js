function InsertControls (neon) {
    // set up listeners to switch between tabs and load the appropriate template
    $("#neumeTab").on("click", function(){
        deactivateTab();
        activate(this.id);
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

        $("#punctum").on("click", function(){
            updateCursor(this.id);
        })
        $("#virga").on("click", function(){
            updateCursor(this.id);
        })
        $("#diamond").on("click", function(){
            updateCursor(this.id);
        })
        $("#white_punct").on("click", function(){
            updateCursor(this.id);
        })
        $("#quilisma").on("click", function(){
            updateCursor(this.id);
        })
        $("#custos").on("click", function(){
            updateCursor(this.id);
        })
    });

    $("#clefTab").on("click", function(){
        deactivateTab();
        activate(this.id);
        $("#insert_data").empty();
        $("#insert_data").append(
            "<p class='control'>" +
            "<button id='cClef' class='button insertel'><img src='/img/cClef.png' class='image' /></button></p>" +
            "<p class='control'>" +
            "<button id='fClef' class='button insertel'><img src='/img/fClef.png' class='image'/></button></p>"
        );
        $("#cClef").on("click", function(){
            updateCursor(this.id);
        })
        $("#fClef").on("click", function(){
            updateCursor(this.id);
        })
    });

    $("#systemTab").on("click", function(){
        deactivateTab();
        activate(this.id);
        $("#insert_data").empty();
        $("#insert_data").append(
            "<p class='control'>" +
            "<button id='staff' class='button insertelLong'><img src='/img/staff.png' class='image' /></button></p>" +
            "<input id='staffSlider' class='slider is-fullwidth' min='10' max='100' value='50' step='1' type='range'/>" +
            "<output for='staffSlider'>100</output>"
        );
    });

    $("#divisionTab").on("click", function(){
        deactivateTab();
        activate(this.id);
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
    });

    function activate(id) {
        $("#" + id)[0].classList.add('is-active');
    }

    function deactivateTab() {
        var tabs = d3.selectAll(".insertTab")._groups[0];
        for (i=0; i<tabs.length; i++){
            if(tabs[i].classList.length > 1){
                tabs[i].classList.remove('is-active');
            }
        }
    }

    function updateCursor(id) {
        var url = 'url(/img/' + id + '.png), auto';
        $("#bgimg").css('cursor', url);
        $("#mei_output").css('cursor', url);
    }
      
    // Default to neume tab on initial load
    $("#neumeTab").click();
    
    Neon.prototype.deactivateTab = deactivateTab;
    Neon.prototype.activate = activate;

}