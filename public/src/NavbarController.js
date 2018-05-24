function NavbarController(filename) { 
    // setup navbar listeners 
    $("#revert").on("click", function() {
        $.ajax({
            type: "POST",
            url: "/revert/" + filename,
        })
    });
}
