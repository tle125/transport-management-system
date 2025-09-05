// Firebase Configuration
// กรุณาใส่ Firebase config ที่ได้จาก Firebase Console

// Import Firebase modules from CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, connectFirestoreEmulator } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getAuth, connectAuthEmulator } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

// Firebase configuration object
// ค่าจาก Firebase Console สำหรับโปรเจ็กต์ wh1-transport
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
export { db, auth, app };

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