/*
  `AdvancedSettings.ts`
  Module that handles everything to do with advanced settings.

  Any file that imports `AdvancedSettings` can only access the `init` function.

  I'm using the module design pattern, since that's what
  JavaScript does internally with classes anyway.

  We keep track of NeonView since it's a hassle to pass it around
  all the time.
*/

import Validation from '../Validation';
import { getSettings, setSettings } from './LocalSettings';
import NeonView from '../NeonView';


let view: NeonView;

function init(neonView: NeonView): void {
  view = neonView;

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
  toggle(checkbox.checked);
}

function toggle(isChecked: boolean) {
  if (isChecked)
    enable();
  else
    disable();
}

async function enable() {
  await Validation.init(view);
  // Validation.sendForValidation(mei);

  const uri = view.view.getCurrentPageURI();
  const mei = await view.getPageMEI(uri);

  await Validation.sendForValidation(mei);
}

function disable() {
  Validation.stop();
}

export default { init };
