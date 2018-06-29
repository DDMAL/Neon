export default function EditListeners () {

    function initListeners () {
        //Selection mode toggle
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
                if(!$(this).parent().hasClass("selected")){
                    unselectNeumes();
                    $(this).parent().attr("fill", "#d00");
                    $(this).parent()[0].classList.add("selected");
                }
            }
            else if ($("#selByNc").hasClass("is-active")){
                if(!$(this).hasClass("selected")){
                    unselectNcs();
                    $(this).attr("fill", "#d00");
                    $(this)[0].classList.add("selected");
                }
            }
            else {
                console.log("error: selection mode not activated");
            }
        })

        // click away listeners
        $(document).on("click", function() {
           unselectNeumes();
           unselectNcs();
        })

        $("#mei_output").on("click", function(e){
            e.stopPropagation();
        })
    }

    function unselectNeumes() {
        var neumes = $(".neume.selected");
        for (var i=0; i<neumes.length; i++){
            $(neumes[i]).removeClass("selected").attr("fill", null);
        }
    }

    function unselectNcs() {
        var ncs = $(".nc.selected");
        for (var i=0; i<ncs.length; i++){
            $(ncs[i]).removeClass("selected").attr("fill", null);
        }
    }

    EditListeners.prototype.initListeners = initListeners;
}