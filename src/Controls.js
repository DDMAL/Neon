function Controls (neon, zoomHandler) {

    setZoomControls();
    setOpacityControls();
    setBackgroundOpacityControls();
    setSylControls();

    function setZoomControls() {
        $("#reset-zoom").click( function() {
            zoomHandler.resetZoomAndPan();
        });

        $(document).on('input change', '#zoomSlider', function () {
            zoomHandler.zoomTo($("#zoomOutput").val() / 100.0)
        })
    }

    // TODO: Potentially separate opacity into its own js file as well? similar to zoom
    // Though as it stands its pretty small so it might be fine here
    function setOpacityControls() {
        $("#reset-opacity").click( function() {
            // Definition scale is the root element of what is generated by verovio
            var meiSel = d3.select(".definition-scale");
            meiSel.style("opacity", 1);

            $("#opacitySlider").val(100);
            $("#opacityOutput").val(100);
        })

        $(document).on('input change', '#opacitySlider', setOpacityFromSlider);
    }

    function setBackgroundOpacityControls() {
        $("#reset-bg-opacity").click( function() {
            var bgSel = d3.select("#bgimg");
            bgSel.style("opacity", 1);

            $("#bgOpacitySlider").val(100);
            $("#bgOpacityOutput").val(100);
        })

        $(document).on('input change', '#bgOpacitySlider', function () {
            var bgSel = d3.select("#bgimg");
            var opacitySliderValue = $("#bgOpacityOutput").val();
            bgSel.style("opacity", opacitySliderValue / 100.0);
        });
    }

    function shouldHideText() {
        return (!$("#displayText").is(":checked"));
    }

    function setSylControls() {
        $("#displayText").click( function () {
            neon.refreshPage();
        });
    }

    function setOpacityFromSlider() {
        var meiSel = d3.select(".definition-scale");
        var opacitySliderValue = $("#opacityOutput").val();
        meiSel.style("opacity", opacitySliderValue / 100.0);
    };

    Controls.prototype.constructor = Controls;
    Controls.prototype.setZoomControls = setZoomControls;
    Controls.prototype.setOpacityControls = setOpacityControls;
    Controls.prototype.setBackgroundOpacityControls = setBackgroundOpacityControls;
    Controls.prototype.shouldHideText = shouldHideText;
    Controls.prototype.setSylControls = setSylControls;
    Controls.prototype.setOpacityFromSlider = setOpacityFromSlider;
}

export { Controls };
