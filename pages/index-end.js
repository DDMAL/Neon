
let selector = document.getElementById("page-selector");
selectionOptions.forEach(option => {
    var elem = document.createElement('option');
    elem.setAttribute("value", '{"mei":"' + option.mei + '","img":"' + option.img + '"}');
    elem.innerHTML = option.name;
    selector.appendChild(elem);
});
