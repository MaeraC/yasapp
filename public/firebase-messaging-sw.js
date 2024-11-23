
// Fichier public/firebase-messaging-sw.js

self.addEventListener('error', (event) => {
    console.error('Erreur dans le Service Worker :', event.message)
})

self.addEventListener('unhandledrejection', (event) => {
    console.error('Promesse non gérée dans le Service Worker :', event.reason)
})

importScripts('firebase/firebase-app.js')
importScripts('firebase/firebase-messaging.js')

const firebaseConfig = {
    apiKey: "AIzaSyAiF_wMsg7qelPEqXIBlI6C4Pz6ZrxnR4A",
    authDomain: "yasapp-1e3cf.firebaseapp.com",
    projectId: "yasapp-1e3cf",
    storageBucket: "yasapp-1e3cf.firebasestorage.app",
    messagingSenderId: "625578653182",
    appId: "1:625578653182:web:d7930acbf24b4f9b433caf"
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
    console.log("Message reçu en arrière-plan : ", payload)

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
})
