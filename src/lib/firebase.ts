import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, onAuthStateChanged, User } from "firebase/auth";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY, 
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID, 
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
  };

// Initialize Firebase with proper types
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let analytics: Analytics | undefined;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Initialize Analytics only in client-side
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { 
  auth, 
  onAuthStateChanged,
  analytics,
  type User
};