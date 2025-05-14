// Firebase Messaging Service Worker
self.addEventListener("push", (event) => {
    const notif = event.data.json().notification;
    const notificationOptions = {
        body: notif.body,
        icon: notif.image,
        data: {
            url: notif.click_action
        }
    };

    // Generate a unique tag using timestamp if notificationId is not provided
    notificationOptions.tag = `notification-${Date.now()}`;

    // Display the notification
    event.waitUntil(self.registration.showNotification(notif.title, notificationOptions));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close(); // Close the notification when clicked

    // Check if the notification has a data payload with a URL
    if (event.notification.data && event.notification.data.url) {
        // Open the URL when the notification is clicked
        event.waitUntil(clients.openWindow(event.notification.data.url));
    }
});