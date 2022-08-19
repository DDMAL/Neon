/*
  `AdvancedSettings.ts`
  Module that handles everything to do with advanced settings.

  Any file that imports `AdvancedSettings` can only access the `init` and `isEnabled` functions.

  I'm using the module design pattern, since that's what
  JavaScript does internally with classes anyway.

  We keep track of NeonView since it's a hassle to pass it around all the time.
*/

import Validation from '../Validation';
import { getSettings, setSettings } from './LocalSettings';
import NeonView from '../NeonView';
import ErrorLog from './ErrorLog';
import { updateDisplayAll } from '../DisplayPanel/DisplayPanel';


let view: NeonView;

function init(neonView: NeonView): void {
  view = neonView;

  const checkbox = document.querySelector<HTMLInputElement>('#display-advanced');

  // Listen to click:
  checkbox.addEventListener('click', handleClick);

  // Load from localStorage:
  const { displayAdvanced } = getSettings();
  checkbox.checked = displayAdvanced;

  toggle(checkbox.checked);
  updateDisplayAll();
}

function handleClick() {
  const checkbox = document.querySelector<HTMLInputElement>('#display-advanced');

  // Before turning on advanced settings, make the user have to confirm the decision
  if (checkbox.checked) {
    const confirmed = window.confirm(
      'This option is for developers and testers, and is not recommended for general users. ' +
      'Are you sure you wish to proceed?'
    );

    if (!confirmed) {
      checkbox.checked = false;
      return;
    }
  }

  toggle(checkbox.checked);
  updateDisplayAll();
}

function isEnabled(): boolean {
  return document.querySelector<HTMLInputElement>('#display-advanced').checked;
}

function toggle(isChecked: boolean) {
  setSettings({ displayAdvanced: isChecked });

  if (isChecked)
    enable();
  else
    disable();
}

function $<T extends HTMLElement>(query: string) {
  return document.querySelector<T>(query);
}

async function enable() {
  ErrorLog.init();
  await Validation.init(view);

  // Retrieve the page MEI as a trivial action to do
  // to activate validation of the current page
  const uri = view.view.getCurrentPageURI();
  const mei = await view.getPageMEI(uri);
  await Validation.sendForValidation(mei);

  // Show MEI actions dropdown
  $('#mei-actions-dropdown').style.display = '';
}

function disable() {
  ErrorLog.stop();
  Validation.stop();

  $('#mei-actions-dropdown').style.display = 'none';
}

export default { init, isEnabled };
