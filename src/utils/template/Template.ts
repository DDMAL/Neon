import NeonView from '../../NeonView';
import { ModalView } from '../Modal';

async function setBody (neonView: NeonView): Promise<void> {

  const response = await fetch(__ASSET_PREFIX__ + 'assets/template.html');
  document.body.innerHTML = await response.text();
  (document.getElementById('home-link') as HTMLAnchorElement).href = __LINK_LOCATION__;
  document.getElementById('neon-version').textContent = __NEON_VERSION__;

  // hotkey btn onclick event listener
  document.getElementById('navbar-item-hotkeys').addEventListener('click', function() {
    neonView.modal.openModal(ModalView.HOTKEYS);
  });

}

export { setBody as default };