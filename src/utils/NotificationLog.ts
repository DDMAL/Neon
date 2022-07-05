import { Notification } from './Notification';
import { errorLogsPanelContents } from '../SquareEdit/Contents';

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
      <img class="log-remove remove-notif-icon" src="/Neon/assets/img/garbage-closed.svg">
    </div>
  `;

  const remove = notifDiv.querySelector<HTMLButtonElement>('.log-remove');
  remove.onclick = () => notifDiv.remove();
  remove.addEventListener('mouseover', () => {
    remove.setAttribute('src', '/Neon/assets/img/garbage-open.svg')
  });
  remove.addEventListener('mouseout', () => {
    remove.setAttribute('src', '/Neon/assets/img/garbage-closed.svg')
  });

  return notifDiv;
}


/**
 * Add notification to the persistent notification log on the sidebar
 * @param notif {Notification} Notification to add to the notification log
 */
export function recordNotification (notif: Notification): void {
  const log = document.querySelector('#notifLogContents');
  log.prepend(createLogMessage(notif));
}


/**
 * Initialize notification log.
 * Adds necessary HTML to DOM.
 */
export function initNotificationLog(): void {
  const log = document.querySelector('#notification_log');
  log.innerHTML = errorLogsPanelContents;

  initNotificationLogControls();
}


/**
 * Set up event listeners for Notification Log panel
 */
export function initNotificationLogControls(): void {
  const heading = document.querySelector('#notifLogHeading');
  const dropdownIcon = heading.querySelector('svg > use');
  const contents = document.querySelector('#notifLogContents') as HTMLElement;

  heading.addEventListener('click', (e) => {
    e.stopPropagation();
    // if notif panel is closed, open it
    if (contents.classList.contains('closed')) {
      // set classes and styles for an open panel
      contents.classList.remove('closed');
      contents.style.padding = '0.5em 0.75em';
      setTimeout(() => {
        contents.style.overflow = 'visible';
      }, 200);
      dropdownIcon.setAttribute('xlink:href', `${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down`);
    } 
    // if notif panel is open, close it
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
}


/**
 * Initializes click listener on "Show error logs" button in "View" dropdown.
 */
export function initDropdownListener(): void {
  const showErrorLogsBtn = document.querySelector('#show-error-logs-btn');
  const checkmark = document.querySelector('#show-error-logs-checkmark-icon');
  const notifPanel = document.querySelector('#notification_log');

  showErrorLogsBtn.addEventListener('click', () => {
    if (checkmark.classList.contains('selected')) {
      checkmark.classList.remove('selected');
      notifPanel.classList.remove('visible');
    }
    else {
      checkmark.classList.add('selected');
      notifPanel.classList.add('visible');
    }
  });
}