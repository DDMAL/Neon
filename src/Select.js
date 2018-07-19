import ColorStaves, {highlight, unhighlight} from "./ColorStaves.js";

/**
 * Handle click selection and mark elements as selected.
 * @constructor
 * @param {DragHandler} dragHandler - An instantiated DragHandler object.
 */
function Select (dragHandler, selectOptions) {
    var lastSelect = new Array(0);
    selectListeners();
    //Selection mode toggle
    function selectListeners() {
        var classesToSelect = ".nc, .clef, .custos";
        $(".sel-by").on("click", function() {
            var tabs = Array.from($(".sel-by"));
            tabs.forEach(el => {
                if($(el).hasClass("is-active")){
                    $(el).toggleClass("is-active");
                }
            })

            $(this).toggleClass("is-active");
        });

        //Activating selected neumes
        $(classesToSelect).on("click", function() {
            var isNc= $(this).hasClass("nc");
            if(!isNc && !($("#selByStaff").hasClass("is-active"))){
                if ($(this).hasClass("clef")){
                    selectClefs(this);
                }
                else if($(this).hasClass("custos")){
                    selectNcs(this);
                }
            }
            else if ($("#selBySyl").hasClass("is-active") && isNc) {
                var neumeParent = $(this).parent();
                if($(neumeParent).hasClass("neume")){
                    var parentSiblings = Array.from($(neumeParent).siblings());
                    if(parentSiblings.length != 0){
                        selectSyl(neumeParent);
                    }
                    else{
                        selectNeumes(this);
                    }
                }
                else{
                    console.log("Error: parent should be neume.");
                }
            }
            else if ($("#selByNeume").hasClass("is-active") && isNc){
                var siblings = Array.from($(this).siblings());
                if(siblings.length != 0) {
                    selectNeumes(this);
                }
                else{
                    selectNcs(this);
                }            
            }
            else if ($("#selByNc").hasClass("is-active") && isNc){
                selectNcs(this);
            }
            else if ($("#selByStaff").hasClass("is-active")) {
                var staff = $(this).parents(".staff");
                if (!staff.hasClass("selected")) {
                    unselect();
                    staff.addClass("selected");
                    highlight(staff[0], "#d00");
                    dragHandler.dragInit();
                }
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
            selectOptions.endOptionsSelection();
            unselect();
        })

        $(classesToSelect).on("click", function(e){
            e.stopPropagation();
        })

        $("#moreEdit").on("click", function(e) {
            e.stopPropagation();
        })

        //General select and unselect functions
        function select(el) {
            $(el).attr("fill", "#d00");
            $(el).addClass("selected");
        }

        function unselect() {
            var els = $(".selected");
            for (var i=0; i<els.length; i++){
                if ($(els[i]).hasClass("staff")) {
                    $(els[i]).removeClass("selected");
                    unhighlight(els[i]);
                } else {
                    $(els[i]).removeClass("selected").attr("fill", null);
                }
            }

            if ($("#highlightStaves").is(":checked")) {
                let color = new ColorStaves();
                color.setColor();
            }
        }

        //Specific select functions
        function selectSyl(el) {
            if(!$(el).parent().hasClass("selected")){
                unselect();
                select($(el).parent());
                selectOptions.triggerSylActions(); 
                dragHandler.dragInit(); 
            }
        }

        function selectNeumes(el) {
            if(!$(el).parent().hasClass("selected")){
                unselect();
                select($(el).parent());
                selectOptions.triggerNeumeActions(); 
                dragHandler.dragInit(); 
            } 
        }
        function selectNcs(el) {
            if(!$(el).hasClass("selected")){
                unselect();
                select(el);
                selectOptions.triggerNcActions(lastSelect);
                dragHandler.dragInit();
            }
        }

        function selectClefs(el){
            if(!$(el).hasClass("selected")){
                unselect();
                select(el);
                selectOptions.triggerClefActions();
                dragHandler.dragInit();
            }
        }
    }

    Select.prototype.selectListeners = selectListeners;
}
export {Select as default};
