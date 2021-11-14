import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { browserSessionPersistence, getAuth, setPersistence } from '@firebase/auth';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDsF7RMtwacYeIGbEz3X_9Z8SNLAqSB30M",
  authDomain: "mergetrip.io",
  projectId: "mergetrip-66b11",
  databaseURL: "https://mergetrip-66b11-default-rtdb.firebaseio.com/",
  storageBucket: "mergetrip-66b11.appspot.com",
  messagingSenderId: "14509175384",
  appId: "1:14509175384:web:b98365cafeb4db7e56d02d",
  measurementId: "G-1MW1Z2SLT1"
};

// Initialize Firebase
// eslint-disable-next-line
const app = initializeApp(firebaseConfig);
//set persistance
const auth = getAuth();
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Persistance Set");
  })
  .catch((error) => {
    console.log(error.message);
  })
// const analytics = getAnalytics(app);

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
