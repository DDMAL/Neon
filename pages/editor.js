import NeonView from "../src/NeonView.js";

let mei = getGetParam("mei");
let img = getGetParam("img");

var view = new NeonView({
    meifile: "./" + mei,
    bgimg: "./" + img,
    mode: "pages"
});

function getGetParam(paramName) {
    let result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach((item) => {
            tmp = item.split("=");
            if (tmp[0] === paramName) {
                result = decodeURIComponent(tmp[1]);
            }
        });
    return result;
}
