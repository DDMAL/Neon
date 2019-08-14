const template = require('./template.html');

declare const __LINK_LOCATION__: string;
declare const __NEON_VERSION__: string;

function setBody () {
  document.body.innerHTML = template;
  (<HTMLAnchorElement>document.getElementById('home-link')).href = __LINK_LOCATION__;
  document.getElementById('neon-version').textContent = __NEON_VERSION__;
}

export { setBody as default };
