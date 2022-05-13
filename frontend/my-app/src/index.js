import React from 'react';
import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './stylesheets/index.css';
import './stylesheets/main.css';
import './stylesheets/ReactToastify.min.css'
import App from './App';
import reportWebVitals from './reportWebVitals';


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<StrictMode>
  <App />
</StrictMode>);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
