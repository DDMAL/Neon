/** @module utils/Notification */

const uuid = require('uuid/v4');

/** @type {Array.<module:Notification~Notification>} */
var notifications = new Array(0);
/** @type {module:Notification~Notification} */
var currentModeMessage = null;
var notifying = false;

/**
 * Number of notifications to display at a time.
 * @type {number}
 */
const NUMBER_TO_DISPLAY = 3;

/**
 * Add a notification to the queue.
 * @param {string} notification
 */
export function queueNotification (notification) {
  let notif = new Notification(notification);
  notifications.push(notif);
  if (!notifying || document.getElementById('notification-content').querySelectorAll('.neon-notification').length < NUMBER_TO_DISPLAY) {
    startNotification();
  }
}

/**
 * Start displaying notifications. Called automatically.
 */
function startNotification () {
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
 * @param {module:Notification~Notification} notification
 */
function displayNotification (notification) {
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
 * @param {string} currentId - The ID of the notification to be cleared.
 */
function clearOrShowNextNotification (currentId) {
  // clear notification currently displayed

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
  /**
   * Create a new notification
   * @param {string} message
   */
  constructor (message) {
    this.message = message;
    this.displayed = false;
    this.id = uuid();
    this.isModeMessage = message.search('Mode') !== -1;
    this.timeoutID = -1;
  }

  setTimeoutId (id) {
    this.timeoutID = Math.max(id, -1);
  }

  display () {
    this.displayed = true;
  }

  /**
   * Get the UUID for this notification
   * @returns {string}
   */
  getId () {
    return this.id;
  }
}
