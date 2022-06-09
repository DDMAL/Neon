import NeonView from '../../NeonView';
import { ModalWindowView } from '../ModalWindow';

async function setBody (neonView: NeonView): Promise<void> {

  const response = await fetch(__ASSET_PREFIX__ + 'assets/template.html');
  document.body.innerHTML = await response.text();
  (document.getElementById('home-link') as HTMLAnchorElement).href = __LINK_LOCATION__;
  document.getElementById('neon-version').textContent = __NEON_VERSION__;

  document.getElementById('filename').innerText = `${neonView.manifest.title}`;

  // hotkey btn onclick event listener
  document.getElementById('navbar-item-hotkeys').addEventListener('click', function() {
    neonView.modal.setModalWindowView(ModalWindowView.HOTKEYS);
    neonView.modal.openModalWindow();
  });
}

export { setBody as default };