import React from 'react';
import ReactDOM from 'react-dom/client';
// RUTA CORREGIDA: Apunta a la carpeta components
import ChatWidget from './components/ChatWidget';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("No se encontró el elemento root en index.html");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <div className="relative min-h-screen w-full flex items-end justify-end p-6">
       <ChatWidget />
    </div>
  </React.StrictMode>
);
