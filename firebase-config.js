// Firebase Configuration
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getFirestore, connectFirestoreEmulator } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getAuth, connectAuthEmulator } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDg8DHtOW9oYZ377ZZVvKu-wpZ17hZ6S70",
  authDomain: "wh1-transport.firebaseapp.com",
  projectId: "wh1-transport",
  storageBucket: "wh1-transport.firebasestorage.app",
  messagingSenderId: "461973585564",
  appId: "1:461973585564:web:1fd47c8bc56b5cd99f7759",
  measurementId: "G-D74ZL4XPZ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// For development - uncomment these lines if using Firebase emulators
// if (location.hostname === 'localhost') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectAuthEmulator(auth, 'http://localhost:9099');
// }

// Export Firebase services
export { db, auth, app, analytics };

// Firebase utility functions
export const FirebaseUtils = {
  // Check if Firebase is properly configured
  isConfigured() {
    return firebaseConfig.apiKey !== "your-api-key" && firebaseConfig.projectId === "wh1-transport";
  },
  
  // Get current timestamp
  getTimestamp() {
    return new Date().toISOString();
  },
  
  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};