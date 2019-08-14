import * as uuid from 'uuid/v4';

var notifications: Notification[] = new Array(0);
var currentModeMessage: Notification = null;
var notifying: boolean = false;

/**
 * Number of notifications to display at a time.
 */
const NUMBER_TO_DISPLAY: number = 3;

/**
 * Add a notification to the queue.
 */
export function queueNotification (notification: string): void {
  let notif = new Notification(notification);
  notifications.push(notif);
  if (!notifying || document.getElementById('notification-content').querySelectorAll('.neon-notification').length < NUMBER_TO_DISPLAY) {
    startNotification();
  }
}

/**
 * Start displaying notifications. Called automatically.
 */
function startNotification (): void {
  if (notifications.length > 0) {
    notifying = true;
    let currentNotification = notifications.pop();
    displayNotification(currentNotification);
    currentNotification.setTimeoutId(window.setTimeout(clearOrShowNextNotification, 5000, currentNotification.getId()));
    document.getElementById(currentNotification.getId()).addEventListener('click', () => {
      window.clearTimeout(currentNotification.timeoutID);
      clearOrShowNextNotification(currentNotification.getId());
    });
  }
}

/**
 * Display a notification.
 */
function displayNotification (notification: Notification): void {
  if (notification.isModeMessage) {
    if (currentModeMessage === null) {
      currentModeMessage = notification;
    } else {
      window.clearTimeout(currentModeMessage.timeoutID);
      notifications.push(notification);
      clearOrShowNextNotification(currentModeMessage.getId());
      return;
    }
  }
  let notificationContent = document.getElementById('notification-content');
  notificationContent.innerHTML += "<div class='neon-notification' id='" + notification.getId() + "'>" + notification.message + '</div> ';
  notificationContent.setAttribute('display', '');
  notification.display();
}

/**
 * Clear the notifications if no more exist or display another from the queue.
 * @param currentId - The ID of the notification to be cleared.
 */
function clearOrShowNextNotification (currentId: string): void {
  document.getElementById(currentId).remove();
  if (currentModeMessage !== null && currentModeMessage.getId() === currentId) {
    currentModeMessage = null;
  }
  if (notifications.length > 0) {
    startNotification();
  } else if (document.querySelectorAll('.neon-notification').length === 0) {
    document.getElementById('notification-content').setAttribute('display', 'none');
    notifying = false;
  }
}

/**
 * A class to manage Neon notifications.
 */
class Notification {
  message: string;
  displayed: boolean;
  id: string;
  isModeMessage: boolean;
  timeoutID: number;
  /**
   * Create a new notification.
   */
  constructor (message: string) {
    this.message = message;
    this.displayed = false;
    this.id = uuid();
    this.isModeMessage = message.search('Mode') !== -1;
    this.timeoutID = -1;
  }

  /** Set the ID from setTimeout. */
  setTimeoutId (id: number) {
    this.timeoutID = Math.max(id, -1);
  }

  /** Display the Notification. */
  display () {
    this.displayed = true;
  }

  /**
   * Get the UUID for this notification
   */
  getId (): string {
    return this.id;
  }
}
