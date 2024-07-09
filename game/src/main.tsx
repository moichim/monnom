import React from 'react'
import ReactDOM from 'react-dom/client'
import { Site } from './components/Site.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('gameRoot')!).render(
  <React.StrictMode>
    <Site />
  </React.StrictMode>,
)
