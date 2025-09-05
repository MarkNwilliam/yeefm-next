import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, onAuthStateChanged, User } from "firebase/auth";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: 'AIzaSyBXS56tIro9cd-Sd4ySn5AwLw3T6cnMHr0',
  authDomain: 'yeeplatform.firebaseapp.com',
  projectId: 'yeeplatform',
  storageBucket: 'yeeplatform.appspot.com',
  messagingSenderId: '272587831821',
  appId: '1:272587831821:web:b612b427ff43968f33f344',
  measurementId: 'G-YZV03469PP'
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields: (keyof typeof firebaseConfig)[] = [
    'apiKey', 
    'authDomain', 
    'projectId', 
    'storageBucket', 
    'messagingSenderId', 
    'appId'
  ];
  
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    console.error('Missing Firebase configuration fields:', missingFields);
    console.error('Current config:', {
      apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
      authDomain: firebaseConfig.authDomain ? 'Set' : 'Missing',
      projectId: firebaseConfig.projectId ? 'Set' : 'Missing',
      storageBucket: firebaseConfig.storageBucket ? 'Set' : 'Missing',
      messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'Missing',
      appId: firebaseConfig.appId ? 'Set' : 'Missing',
    });
    throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
  }
};

// Initialize Firebase with proper types and error handling
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let analytics: Analytics | undefined;

if (typeof window !== 'undefined') {
  try {
    // Validate configuration before initializing
    validateFirebaseConfig();
    
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Initialize Analytics only in client-side
    isSupported().then((supported) => {
      if (supported && app) {
        analytics = getAnalytics(app);
      }
    }).catch((error) => {
      console.warn('Analytics initialization failed:', error);
    });
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    // You might want to show a user-friendly error message here
  }
}

export { 
  app,
  auth, 
  onAuthStateChanged,
  analytics,
  type User
};