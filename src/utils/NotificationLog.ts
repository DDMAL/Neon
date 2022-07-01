import { Notification } from './Notification';

class NotificationLog {
  container: HTMLDivElement;
  notifications: Notification[];

  constructor() {
    this.container = document.querySelector<HTMLDivElement>('#notification_log');
    this.notifications = [];
  }
}

function createLogMessage (notif: Notification): Element {
  const notifDiv = document.createElement('div');
  notifDiv.textContent = notif.message;

  return notifDiv;
}

// The one NotificationLog object that will be used
let log: NotificationLog;

/**
 * Initialize the sidebar notification log
 */
export function initNotificationLog (): void {
  log = new NotificationLog();
}

/**
 * Add notification to the persistent notification log on the sidebar
 * @param notif {Notification} Notification to add to the notification log
 */
export function recordNotification (notif: Notification): void {
  log.notifications.push(notif);
  log.container.appendChild(createLogMessage(notif));
}