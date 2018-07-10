export default function Select (dragHandler) {
    selectListeners();
    //Selection mode toggle
    function selectListeners() {
        var classesToSelect = ".nc, .clef, .custos";
        $("#selByNeume").on("click", function(){
            if ($("#selByNc").hasClass("is-active")){
                $("#selByNc").toggleClass('is-active');
                $("#selByNeume").toggleClass('is-active');
            }           
        });

        $("#selByNc").on("click", function(){
            if ($("#selByNeume").hasClass("is-active")){
                $("#selByNeume").toggleClass('is-active');
                $("#selByNc").toggleClass('is-active');
            } 
        });

        //Activating selected neumes
        $(classesToSelect).on("mousedown", function() {
            var isNc= $(this).hasClass("nc");
            if ($("#selByNeume").hasClass("is-active") && isNc){
                if(!$(this).hasClass("selected")){
                    unselect();
                    $(this).attr("fill", "#d00");
                    $(this).addClass("selected");
                    var siblings = Array.from($(this).siblings());
                    siblings.forEach(el => {
                        if(!$(el).hasClass("selected")){
                            $(el).attr("fill", "#d00");
                            $(el).addClass("selected");
                        }   
                    })                  
                    dragHandler.dragInit();
                }
            }
            else if ($("#selByNc").hasClass("is-active") || !isNc){
                if(!$(this).hasClass("selected")){
                    unselect();
                    $(this).attr("fill", "#d00");
                    $(this).addClass("selected");
                    dragHandler.dragInit();
                }
            }
            else {
                console.log("error: selection mode not activated");
            }
        })

        // // click away listeners

        $("body").on("click keydown", (evt) => {
            if (evt.type === "keydown" && evt.key !== "Escape") return;
            unselect();
        })

        $(classesToSelect).on("click", function(e){
            e.stopPropagation();
        })

        function unselect() {
            var els = $(".selected");
            for (var i=0; i<els.length; i++){
                $(els[i]).removeClass("selected").attr("fill", null);
            }
        }
    }
    Select.prototype.selectListeners = selectListeners;
}
