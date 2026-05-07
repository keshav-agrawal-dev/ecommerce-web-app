import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <div className="relative">
    <a
      href="#root"
      className="fixed bottom-3 right-3 z-99 border border-white rounded-full w-10 h-10 flex justify-center items-center bg-blue-600"
    >
      <i className="fa-solid fa-arrow-up w-3.5 text-white"></i>
    </a>
    <App />
  </div>,
)
