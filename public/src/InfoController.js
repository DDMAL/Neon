function InfoController(vrvToolkit) {

    function infoListeners() {
        var neumes = d3.selectAll(".neume");
        var custos = d3.selectAll(".custos");
        var clefs = d3.selectAll(".clef");

        neumes.call( d3.drag().on("start", setInfo) );
        custos.call( d3.drag().on("start", setInfo) );
        clefs.call( d3.drag().on("start", setInfoClef) );
    }

    function setInfo() {
        updateInfo(this.id);
    }

    function setInfoClef() {
        updateInfoClef(this.parentNode.id);
    }

    // This function updates the neume information box in the editor
    function updateInfo(id) {
        // For now, since Clefs do not have their own element tag in mei4, there is not a way to select the <g> element
        // So we will simply return if ID does not exist for now
        if (id == "") {
            $("#neume_info").empty();
            console.log("No id!");
            return;
        }

        var element = d3.select("#" + id);
        var elementClass = element.attr("class");
        var body = "";

        // Gets the pitches depending on element type and 
        switch(elementClass) {
            case "neume":
            case "custos":
                var infoAction = { action: 'element-info', param: { elementId: id }};
                body = vrvToolkit.query(infoAction);
                break;
            default:
                body += "nothing";
                break;
        }
        updateInfoBox(elementClass, body);
    }
    
    function updateInfoClef(id) {
        // For now, since Clefs do not have their own element tag in mei4, there is not a way to select the <g> element
        // So we will simply return if ID does not exist for now
        if (id == "") {
            $("#neume_info").empty();
            console.log("No id!");
            return;
        }

        var infoAction = { action: "clef-info", param: { elementId: id }};
        var body = vrvToolkit.query(infoAction);
        
        updateInfoBox("clef", body);
    }
    function updateInfoBox(title, body) {
        $("#neume_info").empty();
        $("#neume_info").append(
            "<article class='message'> +
            "<div class='message-header'> <p>" + title + "</p> <button id='notification-delete' class='delete' aria-label='delete'></button> </div>" +
            "<div class='message-body'>" + body + "</div> </article>"
        );

        // Setting up listener for dismissing message
        $("#notification-delete").on("click", function () {
            $("#neume_info").empty();
        })
    }

    InfoController.prototype.infoListeners = infoListeners;
}
