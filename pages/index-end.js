
let selector = document.getElementById("page-selector");
selectionOptions.forEach(option => {
    var elem = document.createElement('option');
    elem.setAttribute("value", option.mei);
    elem.setAttribute("img", option.img);
    elem.innerHTML = option.name;
    selector.appendChild(elem);
});
