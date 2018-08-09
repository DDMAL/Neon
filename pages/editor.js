import NeonView from "../src/NeonView.js";

var params = JSON.parse(decodeURIComponent(window.location.search.substr(1).split('=')[1]));
var view = new NeonView({
    meifile: "./" + params.mei,
    bgimg: "./" + params.img,
    mode: "pages"
});
