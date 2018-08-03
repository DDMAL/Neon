/** @module notification */

var notifications = new Array(0);
var notifying = false;

/**
 * Add a notification to the queue.
 * @param {string} notification
 */
export function queueNotification(notification) {
    notifications.push(notification);
    if (!notifying) {
        startNotification();
    }
}

function startNotification() {
    if (notifications.length > 0) {
        notifying = true;
        let currentNotification = notifications.pop();
        displayNotification(currentNotification);
        window.setTimeout(clearOrShowNextNotification, 5000);
    }
}

function displayNotification(notification) {
    $("#notification-content").append("<p class='box neon-notification'>" + notification + "</p>");
    $("#notification-content").css("display", "");
}

function clearOrShowNextNotification() {
    // clear notification currently displayed
    $("#notification-content").css("display", "none");
    $("#notification-content").empty();
    if (notifications.length > 0) {
        startNotification();
    } else {
        notifying = false;
    }
}
