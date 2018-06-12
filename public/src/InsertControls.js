function InsertControls (neon) {
    $("#neumeTab").on("click", function(){
        deactivateTab();
        activateTab(this.id);
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
    });

    $("#clefTab").on("click", function(){
        deactivateTab();
        activateTab(this.id);
        $("#insert_data").empty();
        $("#insert_data").append(
            "<p class='control'>" +
            "<button id='cClef' class='button insertel'><img src='/img/cClef.png' class='image' /></button></p>" +
            "<p class='control'>" +
            "<button id='fClef' class='button insertel'><img src='/img/fClef.png' class='image'/></button></p>"
        );
    });

    $("#systemTab").on("click", function(){
        deactivateTab();
        activateTab(this.id);
        $("#insert_data").empty();
        $("#insert_data").append(
            "<p class='control'>" +
            "<button id='staff' class='button insertsys'><img src='/img/staff.png' class='image' /></button></p>"
        );
    });

    $("#divisionTab").on("click", function(){
        deactivateTab();
        activateTab(this.id);
        $("#insert_data").empty();
    });

    function activateTab(id) {
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
    
    $("#neumeTab").click();
    
    Neon.prototype.deactivateTab = deactivateTab;
    Neon.prototype.activateTab = activateTab;

}