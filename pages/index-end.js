
let selector = document.getElementById('page-selector');
selectionOptions.forEach(option => {
  var elem = document.createElement('option');
  elem.setAttribute('value', option);
  elem.innerHTML = option;
  selector.appendChild(elem);
});
