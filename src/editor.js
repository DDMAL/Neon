import NeonView from "./NeonView.js";

if (autosave) {
    let url = window.location.href;
    let regex = /\/edit\//;
    if (window.confirm("Newer autosave detected! Do you want to recover lost work?")) {
        $.ajax({
            type: "POST",
            url: url.replace(regex, "/restore/"),
            data: {}
        });
    } else {
        $.ajax({
            type: "POST",
            url: url.replace(regex, "/autosave-clear/"),
            data: {}
        });
    }
}


var view = new NeonView({
    meifile: meiFile,
    bgimg: bgImg,
    mode: "standalone"
});
