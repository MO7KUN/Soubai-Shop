import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js";

// Firebase Config
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

// Check if iOS Safari
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isInStandaloneMode() {
    return ('standalone' in window.navigator) && window.navigator.standalone;
}

// Main logic
function main() {

    if (isIOS() && !isInStandaloneMode()) {
        console.log("iOS device detected – app is not installed as PWA. Notifications won't work.");
        return;
    }

    if (isIOS()) {
        showiOSNotificationPrompt();
    } else {
        // Auto request permission for Android/Desktop
        requestPermissionAndRegister();
    }
};

main()

function requestPermissionManually() {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            registerServiceWorkerAndSaveToken();
        } else {
            console.log("Permission denied by user.");
        }
    });
}

function requestPermissionAndRegister() {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            registerServiceWorkerAndSaveToken();
        } else {
            console.log("Permission denied.");
        }
    });
}

function registerServiceWorkerAndSaveToken() {
    navigator.serviceWorker.register("JS/sw.js").then(registration => {
        getToken(messaging, {
            serviceWorkerRegistration: registration,
            vapidKey: 'BCkb_xDqsSE1NIA5PKvzYzNVOpM3eWdo_A8NwctOt5Oh0mWpQoz0VB3adE4eQCkqrxZO_sHbFUxqCCsvYH08-Co'
        }).then((currentToken) => {
            if (currentToken) {
                saveDeviceToken(currentToken);
            } else {
                console.log("No token available.");
            }
        }).catch((err) => {
            console.error("Error getting token:", err);
        });
    });
}

function saveDeviceToken(notificationToken) {
    fetch("https://sbaishop.com/api/notification/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ userToken: notificationToken }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success" || data.status === "already_registered") {
                console.log("Token saved:", data.message);
                localStorage.setItem("tokenHasBeenRegistred", true);
                cleanupScripts();
            } else {
                console.error("Server error:", data.message);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

// iOS notification prompt with SweetAlert2 in Arabic
function showiOSNotificationPrompt() {
    Swal.fire({
        title: 'هل ترغب في تفعيل الإشعارات؟',
        text: 'سيسمح هذا للتطبيق بإرسال إشعارات حول التنبيهات والطلبات الجديدة.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'نعم، فعّل الإشعارات',
        cancelButtonText: 'لا، شكراً'
    }).then((result) => {
        if (result.isConfirmed) {
            requestPermissionManually();
        } else {
            console.log("المستخدم رفض تفعيل الإشعارات.");
        }
    });
}


function cleanupScripts() {
    const scriptsToRemove = [
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js",
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js",
        "server_side_scripts/notifications/notificationHandler.js"
    ];
    scriptsToRemove.forEach(removeScriptElement);
}

function removeScriptElement(scriptSrc) {
    const script = [...document.getElementsByTagName('script')].find(s => s.src === scriptSrc);
    if (script) {
        script.parentNode.removeChild(script);
        console.log("Script removed:", scriptSrc);
    }
}
