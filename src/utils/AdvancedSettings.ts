import Validation from '../Validation';
import { getSettings, setSettings } from './LocalSettings';
import NeonView from '../NeonView';

// I'm using the module design pattern, since that's what
// JavaScript does internally with classes anyway.

export function init(neonView: NeonView): void {
  const checkbox = document.querySelector<HTMLInputElement>('#display-advanced');

  // Listen to click:
  checkbox.addEventListener('click', () => {
    setSettings({ displayAdvanced: checkbox.checked });
    toggle(checkbox.checked);
  });

  // Load from localStorage:
  const { displayAdvanced } = getSettings();
  checkbox.checked = displayAdvanced;

  // Toggle advanced settings on initialization:
  toggle(checkbox.checked, neonView);
}

function toggle(isChecked: boolean) {
  if (isChecked)
    enable();
  else
    disable();
}

function enable() {
  Validation.init();
}

function disable() {

}

export default { init };
