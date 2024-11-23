
import { useEffect, useState }                              from "react"
import messages                                             from "./datas.json"
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Fichier src/App.js 

const firebaseConfig = {
    apiKey: "AIzaSyAiF_wMsg7qelPEqXIBlI6C4Pz6ZrxnR4A",
    authDomain: "yasapp-1e3cf.firebaseapp.com",
    projectId: "yasapp-1e3cf",
    storageBucket: "yasapp-1e3cf.firebasestorage.app",
    messagingSenderId: "625578653182",
    appId: "1:625578653182:web:d7930acbf24b4f9b433caf"
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

function App() {
    const [message, setMessage]                             = useState("")
    const [error, setError]                                 = useState("")
    const [success, setSuccess]                             = useState("")

    const requestNotificationPermission = async () => {
        try {
            const token = await getToken(messaging, {
                vapidKey: "BJ6gnW3MzPaulf9Y0j0dSkZRx-vkYPlMyLyoyN-IP6dGeuHN0Rt_41Rrwb2CQMhtUwQrnzLTFUVqaQ4UlhCLv-4",
            })
        
            if (token) {
                setSuccess("Notifications activées avec succès !")
                console.log("FCM Token :", token)
                localStorage.setItem("fcmToken", token)
            } 
            else {
                setError("Les notifications ne sont pas autorisées.")
            }
        }
        catch (error) {
            setError("Erreur lors de la demande de permission : " + error)
        }
    }

    const scheduleNotificationInterval = (startHour, startMinute, endHour, endMinute, intervalMinutes, message) => {
        const now = new Date();
    
        // Définir l'heure de début
        const startTime = new Date();
        startTime.setHours(startHour, startMinute, 0, 0);
    
        // Définir l'heure de fin
        const endTime = new Date();
        endTime.setHours(endHour, endMinute, 0, 0);
    
        // Si l'heure de début est passée pour aujourd'hui, planifier pour demain
        if (now > startTime) {
            startTime.setDate(startTime.getDate() + 1);
            endTime.setDate(endTime.getDate() + 1);
        }
    
        // Planification des notifications toutes les `intervalMinutes`
        let currentTime = new Date(startTime);
        while (currentTime <= endTime) {
            const delay = currentTime - now; // Temps avant l'exécution
    
            if (delay >= 0) {
                setTimeout(() => {
                    if ("Notification" in window) {
                        new Notification("Rappel", {
                            body: message,
                            icon: "./logo.png",
                        });
                    }
                    console.log(`Notification envoyée à : ${currentTime}`);
                }, delay);
            }
    
            // Ajouter l'intervalle de temps
            currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
        }
    };

    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    setSuccess("Notifications activées avec succès !")
                } 
                else {
                    setError("Les notifications sont désactivées.")
                }
            })
        }
    
        const savedIndex = parseInt(localStorage.getItem("messageIndex"), 10) || 0
        const messageToDisplay = messages[savedIndex % messages.length]

        // Planification des notifications toutes les 5 minutes entre 12h30 et 13h30
        scheduleNotificationInterval(12, 30, 13, 30, 5, messageToDisplay)

        // Exemple de notification unique à 9h
        //const morningMessage = messages[(savedIndex + 1) % messages.length]
        //scheduleNotificationInterval(9, 0, 9, 5, 5, morningMessage)
        
    }, [])

    useEffect(() => {
        onMessage(messaging, (payload) => {
            console.log("Message reçu :", payload)
            setMessage(payload.notification.body)
        })
    }, [])
    
    return (
        <div>
            <div style={{background: "#CE184B", padding: "20px"}}>
                <p style={{color: "white", textAlign: "center"}}>Hello Gorgeous !</p>
            </div>
            <div style={{padding: "20px"}}>
                <p>Un message s'affichera toutes les 5 minutes entre 12h30 et 13h30.</p>

                <button onClick={requestNotificationPermission} style={{ padding: "10px 20px", backgroundColor: "#CE184B", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", margin: "20px 0" }}>
                    Activer les notifications
                </button>

                {error && <p style={{ color: "red", margin: "20px", textAlign: "center" }}>{error}</p>}
                {success && <p style={{ color: "green", margin: "20px", textAlign: "center" }}>{success}</p>}

                {message && (
                    <div style={{ marginTop: "20px", fontSize: "18px" }}>
                        <strong>Message du jour :</strong>
                        <p>{message}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App