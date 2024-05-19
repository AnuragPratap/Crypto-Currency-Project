import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import CryptoContext from "./CryptoContext";
import 'react-alice-carousel/lib/alice-carousel.css';

// Create a script element for Razorpay and append it to the document head
// const script = document.createElement('script');
// script.src = 'https://checkout.razorpay.com/v1/checkout.js';
// document.head.appendChild(script);
 // Load this file in Index.html

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CryptoContext>
    <App />
    </CryptoContext>
    
  </React.StrictMode>
);
