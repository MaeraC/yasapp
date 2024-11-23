
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

    const scheduleNotification = (hour, minute, message, messageIndex) => {
        const now = new Date()
        const targetTime = new Date()
        targetTime.setHours(hour, minute, 0, 0)
    
        if (now > targetTime) {
          targetTime.setDate(targetTime.getDate() + 1)
        }
    
        const delay = targetTime - now
    
        setTimeout(() => {
            if ("Notification" in window) {
                new Notification("Rappel quotidien", {
                    body: message,
                    icon: "./logo.png",
                })
            }

            setMessage(message)
            const nextIndex = (messageIndex + 1) % messages.length
            localStorage.setItem("messageIndex", nextIndex)
        }, delay)
    }

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
        const messageMorning = messages[savedIndex % messages.length]
        const messageEvening = messages[(savedIndex + 1) % messages.length]
    
        scheduleNotification(9, 0, messageMorning, savedIndex)
        scheduleNotification(12, 25, messageMorning, savedIndex)
        scheduleNotification(12, 30, messageMorning, savedIndex)
        scheduleNotification(12, 35, messageMorning, savedIndex)
        scheduleNotification(12, 40, messageMorning, savedIndex)
        scheduleNotification(12, 45, messageMorning, savedIndex)
        scheduleNotification(12, 50, messageMorning, savedIndex)
        scheduleNotification(12, 15, messageEvening, savedIndex + 1)
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
                <p>Un message s'affichera chaque jour à 9h.</p>

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