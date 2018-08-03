/** @module Notification */

const uuid = require('uuid/v4');

/** @type {Array.<module:Notification~Notification>} */
var notifications = new Array(0);
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
export function queueNotification(notification) {
    let notif = new Notification(notification);
    notifications.push(notif);
    if (!notifying || $("#notification-content").children(".neon-notification").length < NUMBER_TO_DISPLAY) {
        startNotification();
    }
}

/**
 * Start displaying notifications. Called automatically.
 */
function startNotification() {
    if (notifications.length > 0) {
        notifying = true;
        let currentNotification = notifications.pop();
        displayNotification(currentNotification);
        window.setTimeout(clearOrShowNextNotification, 5000, currentNotification.getId());
    }
}

/**
 * Display a notification.
 * @param {module:Notification~Notification} notification
 */
function displayNotification(notification) {
    $("#notification-content").append("<span class='neon-notification' id='" + notification.getId() + "'>" + notification.message + "</span> ");
    $("#notification-content").css("display", "");
    notification.display();
}

/**
 * Clear the notifications if no more exist or display another from the queue.
 * @param {string} currentId - The ID of the notification to be cleared.
 */
function clearOrShowNextNotification(currentId) {
    // clear notification currently displayed
    $(".neon-notification").remove("#" + currentId);
    if (notifications.length > 0) {
        startNotification();
    } else if ($(".neon-notification").length === 0) {
        $("#notification-content").css("display", "none");
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
    constructor(message) {
        this.message = message;
        this.displayed = false;
        this.id = uuid();
    }

    display() {
        this.displayed = true;
    }

    /**
     * Get the UUID for this notification
     * @returns {string}
     */
    getId() {
        return this.id;
    }
}
