export default function Select (dragHandler, selectOptions) {
    var lastSelect = new Array(0);
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
        $(classesToSelect).on("click", function() {
            var isNc= $(this).hasClass("nc");
            if ($("#selByNeume").hasClass("is-active") && isNc){
                var siblings = Array.from($(this).siblings());
                if(siblings.length != 0) {
                    selectNeumes(this);
                }
                else{
                    selectNcs(this);
                }            
            }
            else if ($("#selByNc").hasClass("is-active") || !isNc){
                selectNcs(this);
            }
            else {
                console.log("error: selection mode not activated");
                return;
            }
            lastSelect = Array.from($(".selected"));
        })

        // click away listeners
        $("body").on("keydown", (evt) => { // click
            if (evt.type === "keydown" && evt.key !== "Escape") return;
            endOptionsSelection();
            unselect();
        })

        $(classesToSelect).on("click", function(e){
            e.stopPropagation();
        })

        $("#moreEdit").on("click", function(e) {
            e.stopPropagation();
        })

        function unselect() {
            var els = $(".selected");
            for (var i=0; i<els.length; i++){
                $(els[i]).removeClass("selected").attr("fill", null);
            }
        }

        function selectNeumes(el) {
            if(!$(el).parent().hasClass("selected")){
                unselect();
                $(el).parent().attr("fill", "#d00");
                $(el).parent().addClass("selected");
                selectOptions.triggerNeumeActions(); 
                dragHandler.dragInit(); 
            } 
        }
        function selectNcs(el) {
            if(!$(el).hasClass("selected")){
                unselect();
                $(el).attr("fill", "#d00");
                $(el).addClass("selected");
                selectOptions.triggerNcActions(lastSelect);
                dragHandler.dragInit();
            }
        }
    }

    Select.prototype.selectListeners = selectListeners;
}
