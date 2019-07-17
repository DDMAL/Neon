const template = require('./template.html');

function setBody () {
  document.body.innerHTML = template;
  document.getElementById('home-link').href = LINK_LOCATION;
}

export { setBody as default };
