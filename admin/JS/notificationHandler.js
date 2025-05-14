// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getMessaging,
    getToken
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBnZgBdNyEf7DrhvpMG3JDcgqTndqqJEdY",
    authDomain: "lv-manager.firebaseapp.com",
    projectId: "lv-manager",
    storageBucket: "lv-manager.appspot.com",
    messagingSenderId: "8656677611",
    appId: "1:8656677611:web:b9b1dbcccd52cb14bfecae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register service worker and retrieve token
navigator.serviceWorker.register("JS/sw.js").then(registration => {
    getToken(messaging, {
        serviceWorkerRegistration: registration,
        vapidKey: 'BCkb_xDqsSE1NIA5PKvzYzNVOpM3eWdo_A8NwctOt5Oh0mWpQoz0VB3adE4eQCkqrxZO_sHbFUxqCCsvYH08-Co'
    }).then((currentToken) => {
        if (currentToken) {
            saveDeviceToken(currentToken);
        } else {
            console.log('No registration token available.');
        }
    }).catch((err) => {
        console.error('An error occurred while retrieving token:', err);
    });
});

// Save device token to the server
function saveDeviceToken(notificationToken) {
    fetch('https://sbaishop.com/api/notification/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userToken: notificationToken })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('User token saved successfully:', data.message);
                localStorage.setItem('tokenHasBeenRegistred', true)
                cleanupScripts();
            } else if (data.status === 'already_registered') {
                console.log('User token is already registered:', data.message);
                cleanupScripts();
            } else {
                console.error('Error saving token:', data.message);
            }
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
}

// Remove unnecessary script elements
function cleanupScripts() {
    const scriptsToRemove = [
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js",
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js",
        "server_side_scripts/notifications/notificationHandler.js"
    ];
    scriptsToRemove.forEach(removeScriptElement);
}

// Function to remove a script element by its source
function removeScriptElement(scriptSrc) {
    const script = [...document.getElementsByTagName('script')].find(s => s.src === scriptSrc);
    if (script) {
        script.parentNode.removeChild(script);
        console.log('Script removed:', scriptSrc);
    }
}