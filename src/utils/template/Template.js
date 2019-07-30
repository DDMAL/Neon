const template = require('./template.html');

function setBody () {
  document.body.innerHTML = template;
  document.getElementById('home-link').href = LINK_LOCATION;
  document.getElementById('neon-version').textContent = __NEON_VERSION__;
}

export { setBody as default };
