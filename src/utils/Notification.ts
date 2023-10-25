import { recordNotification } from './ErrorLog';
import { uuidv4 } from './random';

type NotificationType = 'default' | 'error' | 'warning' | 'success';

const notifications: Notification[] = new Array(0);
let currentModeMessage: Notification = null;

/**
 * Number of notifications to display at a time.
 */
const NUMBER_TO_DISPLAY = 3;

/**
 * Number of notifications to display at a time.
 */
const TIMEOUT = 5000;

const notificationIcon: Record<NotificationType, string> = {
  default: '',
  warning: '⚠️ ',
  error: '🔴 ',
  success: '✅ ',
};

/**
 * A class to manage Neon notifications.
 */
export class Notification {
  message: string;
  displayed: boolean;
  id: string;
  isModeMessage: boolean;
  timeoutID: number;
  type: NotificationType;
  /**
   * Create a new notification.
   * @param message - Notification content.
   */
  constructor (message: string, type: NotificationType) {
    this.message = notificationIcon[type] + message;
    this.displayed = false;
    this.id = uuidv4();
    this.isModeMessage = message.search('Mode') !== -1;
    this.timeoutID = -1;
    this.type = type;
  }

  /** Set the ID from setTimeout. */
  setTimeoutId (id: number): void {
    this.timeoutID = Math.max(id, -1);
  }

  /** Display the Notification. */
  display (): void {
    this.displayed = true;
  }

  /**
   * @returns The UUID for this notification.
   */
  getId (): string {
    return this.id;
  }
}

/**
 * Clear the notification
 * @param currentId - The ID of the notification to be cleared.
 */
function clearNotification (currentId: string): void {
  if (document.getElementById(currentId)) {
    document.getElementById(currentId).remove();
  }
}

/**
 * Display a notification.
 * @param notification - Notification to display.
 */
function displayNotification (notification: Notification): void {
  // Not sure what it does, maybe related to rodan/neon
  if (notification.isModeMessage) {
    if (currentModeMessage === null) {
      currentModeMessage = notification;
    } else {
      window.clearTimeout(currentModeMessage.timeoutID);
      return;
    }
  }

  // Remove the top notification if exceeds maxmimum
  notifications.push(notification);
  if (notifications.length > NUMBER_TO_DISPLAY) {
    const toRemove = notifications.shift();
    clearNotification(toRemove.getId());
  }
  const notificationContent = document.getElementById('notification-content');
  const newNotification = document.createElement('div');
  newNotification.classList.add('neon-notification');
  newNotification.classList.add(`neon-notification-${notification.type}`);
  newNotification.id = notification.getId();
  newNotification.innerHTML = notification.message;
  notificationContent.append(newNotification);
  notificationContent.style.display = '';
  notification.display();
}

/**
 * Start displaying notifications. Called automatically.
 */
function startNotification (notification: Notification): void {
  displayNotification(notification);
  notification.setTimeoutId(
    window.setTimeout(clearNotification, TIMEOUT, notification.getId())
  );
  document
    .getElementById(notification.getId())
    .addEventListener('click', () => {
      window.clearTimeout(notification.timeoutID);
      clearNotification(notification.getId());
    });
}

/**
 * Add a notification to the queue.
 * @param notification - Notification content.
 */
export function queueNotification (notificationContent: string, type: NotificationType = 'default'): void {
  const notification = new Notification(notificationContent, type);

  if (notification.type == 'error' || notification.type == 'warning') {
    recordNotification(notification);
  }

  startNotification(notification);
}

export default { queueNotification };
