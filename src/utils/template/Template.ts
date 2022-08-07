import NeonView from '../../NeonView';
import { ModalWindowView } from '../ModalWindow';
import { initNotificationLog } from '../NotificationLog';

async function setBody (neonView: NeonView): Promise<void> {

  const response = await fetch(__ASSET_PREFIX__ + 'assets/template.html');
  document.body.innerHTML = await response.text();
  (document.getElementById('home-link') as HTMLAnchorElement).href = __LINK_LOCATION__;
  document.getElementById('neon-version').textContent = __NEON_VERSION__;
  (<HTMLImageElement> document.getElementById('neon-main-icon')).src = `${__ASSET_PREFIX__}/assets/img/Neon_Icon_3.svg`;
  Array.from(document.getElementsByClassName('external-link-icon')).forEach((el) => {
    (<HTMLImageElement> el).src = `${__ASSET_PREFIX__}/assets/img/external-link.svg`;
  });

  document.getElementById('filename').innerText = `${neonView.manifest.title}`;

  // hotkey btn onclick event listener
  document.getElementById('navbar-item-hotkeys').addEventListener('click', function() {
    neonView.modal.setModalWindowView(ModalWindowView.HOTKEYS);
    neonView.modal.openModalWindow();
  });

  // set initial saved status
  const indicator = document.querySelector<HTMLDivElement>('#file-saved');
  indicator.setAttribute('src', `${__ASSET_PREFIX__}assets/img/saved-icon.svg`);
}

export { setBody as default };