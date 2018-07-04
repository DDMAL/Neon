export default function Select (dragHandler) {
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
        $(".nc").on("mousedown", function() {
            if ($("#selByNeume").hasClass("is-active")){
                if(!$(this).hasClass("selected")){
                    unselectNcs();
                    $(this).attr("fill", "#d00");
                    $(this)[0].classList.add("selected");

                    var siblings = Array.from($(this).siblings());                  
                    siblings.forEach((el) => {
                        $("#" + el.id).attr("fill", "#d00");
                        $("#" + el.id).addClass("selected");
                    })
                    dragHandler.dragInit();
                }
            }
            else if ($("#selByNc").hasClass("is-active")){
                if(!$(this).hasClass("selected")){
                    unselectNcs();
                    $(this).attr("fill", "#d00");
                    $(this)[0].classList.add("selected");
                    dragHandler.dragInit();
                }
            }
            else {
                console.log("error: selection mode not activated");
            }
        })

        // click away listeners
        $(document.body).on("click", function() {
            unselectNcs();
        })

        $(".nc").on("click", function(e){
            e.stopPropagation();
        })

        d3.select("body")
            .on("keydown", function() {
                if (d3.event.key == "Escape") {
                    unselectNcs();
                }
            })

        function unselectNcs() {
            var ncs = $(".nc.selected");
            for (var i=0; i<ncs.length; i++){
                $(ncs[i]).removeClass("selected").attr("fill", null);
            }
        }
    }
    Select.prototype.selectListeners = selectListeners;
}