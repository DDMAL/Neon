import { initErrorLog, updateErrorLogVisibility } from './ErrorLog';
import { getSettings, setSettings } from './LocalSettings';

export function setDebugMode(): void {
  const debugModeCheckbox = document.querySelector<HTMLInputElement>('#debug-mode-checkbox');

  const { debugMode } = getSettings();

  debugModeCheckbox.checked = debugMode;

  initErrorLog();

  updateDebugModeStatus();

  debugModeCheckbox.addEventListener('click', () => {
    updateDebugModeStatus();
  });
}


export function updateDebugModeStatus(): void {
  const debugModeCheckbox = document.getElementById('debug-mode-checkbox') as HTMLInputElement;
  setSettings({ debugMode: debugModeCheckbox.checked });

  const errorLogLabel =  document.getElementById('display-errors').parentNode as HTMLElement;
  const notifPanel = document.querySelector('#error_log');
  if (debugModeCheckbox.checked) {
    errorLogLabel.style.display = '';
  }
  else {
    errorLogLabel.style.display = 'none';
    notifPanel.classList.remove('visible');
  }

  updateErrorLogVisibility();
}