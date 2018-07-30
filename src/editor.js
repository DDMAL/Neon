import NeonView from "./NeonView.js";

if (autosave) {
    if (window.confirm("Newer autosave detected! Do you want to recover lost work?")) {
        let url = window.location.href;
        let regex = /\/edit\//;
        $.ajax({
            type: "POST",
            url: url.replace(regex, "/restore/"),
            data: {}
        });
    }
}


var view = new NeonView({
    meifile: meiFile,
    bgimg: bgImg,
    mode: "standalone"
});
