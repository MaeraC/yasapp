// Permet à la PWA de fonctionner même hors ligne et d'activer les notifications 

self.addEventListener('install', (event) => {
    console.log('Service Worker installé.')
    // Mise en cache des ressources si nécessaire
})

self.addEventListener('activate', (event) => {
    console.log('Service Worker activé.')
})

self.addEventListener('fetch', (event) => {
    console.log('Requête interceptée :', event.request.url)
    // Vous pouvez ici ajouter une logique pour gérer le cache
})

self.addEventListener('push', (event) => {
    const data = event.data.json()
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: './logo.png',
    })
})

