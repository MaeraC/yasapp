
import { useEffect, useState }                              from "react"
import messages                                             from "./datas.json"

function App() {
    const [message, setMessage]                             = useState("")
    const [notificationsPlanned, setNotificationsPlanned]   = useState(false)
    const [permissionGranted, setPermissionGranted]         = useState(false)
    const [error, setError]                                 = useState("")
    const [success, setSuccess]                             = useState("")

    // Permission des notifications
    const requestNotificationPermission = () => {
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                setPermissionGranted(true)
                setSuccess("Notifications activées avec succès !")
            }
            else if (Notification.permission === "default") {
                Notification.requestPermission().then((permission) => {

                    if (permission === "granted") {
                        setPermissionGranted(true)
                        setSuccess("Notifications activées avec succès !")
                    } 
                    else {
                        console.log("Permission refusée.")
                        setError("Vous avez refusé les notifications.")
                    }
                })
            }
            else {
                setError("Les notifications ont été bloquées par votre navigateur.")
            }
        } else {
            console.error("Notifications non supportées dans ce navigateur.")
        }
    }

    // Planifie les notifications 
    const scheduleNotification = (hour, minute, storageKey) => {
        const now = new Date() 
        const targetTime = new Date()
        targetTime.setHours(hour, minute, 0, 0) // Heure cible : 9h

        if (now > targetTime) {
            targetTime.setDate(targetTime.getDate() + 1)
        }

        const delay = targetTime - now

        setTimeout(() => {
            const currentIndex = parseInt(localStorage.getItem(storageKey) || "0", 10)
            const newMessage = messages[currentIndex]
      
            // Affiche le message dans l'interface à 9h
            if (hour === 9) {
                setMessage(newMessage)
            }
      
            // Envoie la notification
            new Notification("Rappel quotidien", {
              body: newMessage,
              icon: "./logo.png" // URL d'une icône pour la notification
            })
      
            const nextIndex = (currentIndex + 1) % messages.length
            localStorage.setItem(storageKey, nextIndex.toString())
        }, delay)
    }

    useEffect(() => {
        // Vérifie si les notifications fonctionnent sur l'appareil
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            setError("Les notifications web ne sont pas supportées sur iOS via Safari.");
        } 
        else {
            if (Notification.permission === "granted") {
                setPermissionGranted(true);
                setSuccess("Notifications activées avec succès !");
            } 
            else if (Notification.permission === "default") {
                requestNotificationPermission();
            }
        }

        if (permissionGranted && !notificationsPlanned) {
            scheduleNotification(9, 0, "messageIndex9");
            scheduleNotification(14, 20, "messageIndex14");
            setNotificationsPlanned(true);
        }
    }, [notificationsPlanned, permissionGranted]);
    

    return (
        <div>
            <div style={{background: "#CE184B", padding: "20px"}}>
                <p style={{color: "white", textAlign: "center"}}>Hello Gorgeous !</p>
            </div>
            <div style={{padding: "20px"}}>
                <p>Un message s'affichera chaque jour à 9h.</p>

                {!permissionGranted && (
                    <p>Veuillez activer les notifications pour recevoir des rappels.</p>
                )}

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