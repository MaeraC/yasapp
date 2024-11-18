importScripts("https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging.js");

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAiF_wMsg7qelPEqXIBlI6C4Pz6ZrxnR4A",
    authDomain: "yasapp-1e3cf.firebaseapp.com",
    projectId: "yasapp-1e3cf",
    storageBucket: "yasapp-1e3cf.firebasestorage.app",
    messagingSenderId: "625578653182",
    appId: "1:625578653182:web:d7930acbf24b4f9b433caf"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Gère les notifications en arrière-plan
messaging.onBackgroundMessage((payload) => {
    console.log("Message reçu en arrière-plan : ", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.icon,
    });
});
