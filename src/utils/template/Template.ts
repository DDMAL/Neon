import template from './template.html';

declare const __LINK_LOCATION__: string;
declare const __NEON_VERSION__: string;

function setBody (): void {
  document.body.innerHTML = template;
  (document.getElementById('home-link') as HTMLAnchorElement)
    .href = __LINK_LOCATION__;
  document.getElementById('neon-version').textContent = __NEON_VERSION__;
}

export { setBody as default };
