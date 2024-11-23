
// Fichier src/index.js

import React                                      from 'react'
import ReactDOM                                   from 'react-dom/client'
import App                                        from './App'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker enregistré avec succès :', registration)
      })
      .catch((error) => {
        console.error('Erreur lors de l\'enregistrement du Service Worker :', error)
      })
  })
}
