import { Notification } from './Notification';

// TODO: styling
function createLogMessage (notif: Notification): Element {
  const notifDiv = document.createElement('div');
  notifDiv.innerHTML = `
    <div style="padding-left: 10px; padding-right: 10px; border: 1px solid lightgray; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div class="log-main">${notif.message}</div>
        <div class="log-extra"></div>
      </div>

      <div style="display: flex; flex-direction: row;">
        <button class="log-remove side-panel-btn">x</button>
      </div>
    </div>
  `;

  const remove = notifDiv.querySelector<HTMLButtonElement>('.log-remove');
  remove.onclick = () => notifDiv.remove();

  return notifDiv;
}

/**
 * Add notification to the persistent notification log on the sidebar
 * @param notif {Notification} Notification to add to the notification log
 */
export function recordNotification (notif: Notification): void {
  const log = document.querySelector('#notification_log');
  log.appendChild(createLogMessage(notif));
}
