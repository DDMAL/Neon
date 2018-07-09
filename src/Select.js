export default function Select (dragHandler, groupingHandler) {
    selectListeners();
    //Selection mode toggle
    function selectListeners() {
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
        $(".nc, .clef, .custos").on("mousedown", function() {
            var isNc = !($(this).hasClass("clef") || $(this).hasClass("custos"));
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
                    triggerNeumeActions();
                }
            }
            else if ($("#selByNc").hasClass("is-active") || !isNc){
                if(!$(this).hasClass("selected")){
                    unselect();
                    $(this).attr("fill", "#d00");
                    $(this).addClass("selected");
                    dragHandler.dragInit();
                    triggerNcActions();
                }
            }
            else {
                console.log("error: selection mode not activated");
            }
            groupingHandler.endGroupingSelection();
        })

        // // click away listeners
        $(document.body).on("click", function(e) {
            unselect();
        })

        $(".nc, .clef, .custos").on("click", function(e){
            e.stopPropagation();
        })

        $("#moreEdit").on("click", function(e){
            e.stopPropagation();
        })

        d3.select("body")
            .on("keydown", function() {
                if (d3.event.key == "Escape") {
                    unselect();
                    groupingHandler.endGroupingSelection();
                }
            })

        function unselect() {
            var els = $(".nc.selected, .clef.selected, .custos.selected");
            for (var i=0; i<els.length; i++){
                $(els[i]).removeClass("selected").attr("fill", null);
            }
        }
    }

    function triggerNcActions() {
        
    }

    function triggerNeumeActions() {

    }
    Select.prototype.selectListeners = selectListeners;
}