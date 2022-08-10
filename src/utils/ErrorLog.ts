import { Notification } from './Notification';
import { errorLogsPanelContents } from '../SquareEdit/Contents';
import { setSettings, getSettings } from './LocalSettings';


// TODO: styling
function createLogMessage (notif: Notification): Element {
  const notifDiv = document.createElement('div');
  notifDiv.classList.add('notification-container');
  notifDiv.innerHTML = `
    <div class="notification-wrapper">

      <div>
        <div class="log-main">${notif.message}</div>
        <div class="log-extra"></div>
      </div>

    </div>

    <div class="remove-notif-icon-wrapper">
      <img class="log-remove remove-notif-icon" src="${__ASSET_PREFIX__}/assets/img/garbage-closed.svg">
    </div>
  `;

  const remove = notifDiv.querySelector<HTMLButtonElement>('.log-remove');
  remove.onclick = () => notifDiv.remove();
  remove.addEventListener('mouseover', () => {
    remove.setAttribute('src', `${__ASSET_PREFIX__}/assets/img/garbage-open.svg`);
  });
  remove.addEventListener('mouseout', () => {
    remove.setAttribute('src', `${__ASSET_PREFIX__}/assets/img/garbage-closed.svg`);
  });

  return notifDiv;
}


/**
 * Add notification to the persistent error log on the sidebar
 * @param notif {Notification} Notification to add to the error log
 */
export function recordNotification (notif: Notification): void {
  const log = document.querySelector('#errorLogContents');
  log.prepend(createLogMessage(notif));
}


/**
 * Initialize error log.
 * Adds necessary HTML to DOM.
 */
export function initErrorLog(): void {
  // Error log panel
  const log = document.querySelector('#error_log');
  log.innerHTML = errorLogsPanelContents;

  initErrorLogControls();
}


/**
 * Set up event listeners for error Log panel
 */
export function initErrorLogControls(): void {
  const errorPanel = document.querySelector('#error_log');
  const heading = document.querySelector('#errorLogHeading');
  const dropdownIcon = heading.querySelector('svg > use');
  const contents = document.querySelector('#errorLogContents') as HTMLElement;

  const { displayErrLog } = getSettings();
  if (displayErrLog) errorPanel.classList.add('visible');

  heading.addEventListener('click', (e) => {
    e.stopPropagation();
    // if error panel is closed, open it
    if (contents.classList.contains('closed')) {
      // set classes and styles for an open panel
      contents.classList.remove('closed');
      contents.style.padding = '0.5em 0.75em';
      setTimeout(() => {
        contents.style.overflow = 'visible';
      }, 200);
      dropdownIcon.setAttribute('xlink:href', `${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down`);
    } 
    // if error panel is open, close it
    else {
      // set classes and styles for a closed panel
      contents.classList.add('closed');
      contents.style.overflow = 'hidden';
      setTimeout(() => {
        contents.style.padding = '0px';
      }, 200);
      dropdownIcon.setAttribute('xlink:href', `${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-side`);
    }
  });

  initDisplayListener();
}


/**
 * Initializes click listener on "Show error logs" button in "View" dropdown.
 */
export function initDisplayListener(): void {
  const notifPanel = document.querySelector('#error_log');
  const checkboxesContainer = document.querySelector('#display-single-container');
  const errorsLabel = document.createElement('label');
  const erorrsBtn = document.createElement('input');

  erorrsBtn.classList.add('checkbox');
  errorsLabel.classList.add('checkbox-container', 'side-panel-btn');
  errorsLabel.textContent = 'Errors';
  erorrsBtn.id = 'display-errors';
  erorrsBtn.type = 'checkbox';
  erorrsBtn.checked = false;
  errorsLabel.appendChild(erorrsBtn);
  checkboxesContainer.append(errorsLabel);


  const { displayErrLog } = getSettings();
  if (displayErrLog) erorrsBtn.checked = true;

  erorrsBtn.addEventListener('click', () => {

    // setSettings({ displayBBox: displayBBoxes.checked });

    const displayAllBtn = document.getElementById('display-all-btn');
    const displayInfo = document.getElementById('displayInfo') as HTMLInputElement;
    const displayBBoxes = document.getElementById('displayBBox') as HTMLInputElement;
    const displayText = document.getElementById('displayText') as HTMLInputElement;
    const displayErrLog = document.getElementById('display-errors') as HTMLInputElement;


    if (erorrsBtn.checked) {
      notifPanel.classList.add('visible');
      setSettings({ displayErrLog: true });

      if (displayInfo?.checked && displayBBoxes?.checked && 
        displayText?.checked && displayErrLog?.checked) {
        displayAllBtn.classList.add('selected');
        displayAllBtn.innerHTML = 'Hide All';
      }
    }
    else {
      notifPanel.classList.remove('visible');
      setSettings({ displayErrLog: false });
      if (displayAllBtn.classList.contains('selected')) {
        displayAllBtn.classList.remove('selected');
        displayAllBtn.innerHTML = 'Display All';
      }
    }
    
  });
}
