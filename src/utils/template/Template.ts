import * as template from '../../../assets/template.html';

function setBody (): void {
  document.body.innerHTML = template.toString();
  (document.getElementById('home-link') as HTMLAnchorElement)
    .href = __LINK_LOCATION__;
  document.getElementById('neon-version').textContent = __NEON_VERSION__;
}

export { setBody as default };
