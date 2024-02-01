import { Notification } from './Notification';
import { errorLogsPanelContents } from '../SquareEdit/Contents';
import { setSettings, getSettings } from './LocalSettings';
import { ModalWindow, ModalWindowView } from './ModalWindow';

function createLogMessage (notif: Notification): Element {
  const notifDiv = document.createElement('div');
  notifDiv.classList.add('notification-container');
  notifDiv.innerHTML = `
      <div class="notification-wrapper">
        <div class="log-main">${notif.message}</div>
        <div class="log-extra"></div>
      </div>

      <div class="notification-btn-container" style="display: flex;">
        <div class="notif-log-info-icon-wrapper">
          <img style="display: none;" class="notif-log-info-icon" src="${__ASSET_PREFIX__}/assets/img/notification-info-icon-light.svg" title="Log Message">
        </div>

        <div class="notif-remove-icon-wrapper">
          <img class="log-remove notif-remove-icon" src="${__ASSET_PREFIX__}/assets/img/garbage-closed.svg" title="Remove">
        </div>
      </div>
  `;

  const removeBtn = notifDiv.querySelector<HTMLButtonElement>('.log-remove');
  removeBtn.onclick = () => notifDiv.remove();
  removeBtn.addEventListener('mouseover', () => {
    removeBtn.setAttribute('src', `${__ASSET_PREFIX__}/assets/img/garbage-open.svg`);
  });
  removeBtn.addEventListener('mouseout', () => {
    removeBtn.setAttribute('src', `${__ASSET_PREFIX__}/assets/img/garbage-closed.svg`);
  });

  if (notif.logInfo) {
    const infoBtn = notifDiv.querySelector<HTMLElement>('.notif-log-info-icon');
    infoBtn.style.display = '';

    removeBtn.style.height = '20px';

    infoBtn.addEventListener('mouseover', () => {
      infoBtn.setAttribute('src', `${__ASSET_PREFIX__}/assets/img/notification-info-icon-dark.svg`);
    });
    infoBtn.addEventListener('mouseout', () => {
      infoBtn.setAttribute('src', `${__ASSET_PREFIX__}/assets/img/notification-info-icon-light.svg`);
    });
    infoBtn.addEventListener('click', () => openErrorLogWindow(notif.logInfo));
  }

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
  erorrsBtn.checked = displayErrLog;

  erorrsBtn.addEventListener('click', () => {
    setSettings({ displayErrLog: erorrsBtn.checked });
    updateErrorLogVisibility();
  });
}


function openErrorLogWindow(log: string) {
  const modalWindow = new ModalWindow();
  modalWindow.setModalWindowView(ModalWindowView.ERROR_LOG, log);
  modalWindow.openModalWindow();
}

export function updateErrorLogVisibility(): void {
  const notifPanel = document.querySelector('#error_log');
  const { debugMode, displayErrLog, displayInfo, displayBBox, displayText } = getSettings();

  const displayAllBtn = document.getElementById('display-all-btn');

  if (debugMode) {
    if (displayErrLog) {
      notifPanel.classList.add('visible');
      if (displayInfo && displayBBox && 
        displayText && displayErrLog) {
        displayAllBtn.classList.add('selected');
        displayAllBtn.innerHTML = 'Hide All';
      }
    }
    else {
      notifPanel.classList.remove('visible');
      if (displayAllBtn.classList.contains('selected')) {
        displayAllBtn.classList.remove('selected');
        displayAllBtn.innerHTML = 'Display All';
      }
    }
  } else {
    notifPanel.classList.remove('visible');
    if (displayInfo && displayBBox && displayText) {
      displayAllBtn.classList.add('selected');
      displayAllBtn.innerHTML = 'Hide All';
    } else {
      displayAllBtn.classList.remove('selected');
      displayAllBtn.innerHTML = 'Display All';
    }
  }
}