/** @module notification */

const uuid = require('uuid/v4');

var notifications = new Array(0);
var notifying = false;

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

function startNotification() {
    if (notifications.length > 0) {
        notifying = true;
        let currentNotification = notifications.pop();
        displayNotification(currentNotification);
        window.setTimeout(clearOrShowNextNotification, 5000, currentNotification.getId());
    }
}

function displayNotification(notification) {
    $("#notification-content").append("<span class='neon-notification' id='" + notification.getId() + "'>" + notification.message + "</span> ");
    $("#notification-content").css("display", "");
    notification.display();
}

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
