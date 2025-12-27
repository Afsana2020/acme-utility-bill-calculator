import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


async function wakeBackend() {
  const url = "https://acme-utility-bill-calculator-backend.onrender.com/ping"; 

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      console.log(`Waking backend... attempt ${attempt}`);
      const res = await fetch(url);

      if (res.ok) {
        console.log("Backend is awake!");
        return; 
      }
    } catch (err) {
      console.log("Backend still sleeping...");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("Backend couldn't be reached. It may wake up later.");
}

wakeBackend();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

