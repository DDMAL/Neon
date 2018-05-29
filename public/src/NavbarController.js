function NavbarController(filename) { 
    // setup navbar listeners 
    // revert listener
    $("#revert").on("click", function() {
        $.ajax({
            type: "POST",
            url: "/revert/" + filename,
        })
    });

    //mei download link
    $("#getmei").attr("href", '/../uploads/mei/' + filename);

    //png download setup
    var pngFile = filename.split('.', 2)[0] + ".png";
    $("#getpng").attr("href", '/../uploads/png/' + pngFile);
    
}
