import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, onAuthStateChanged, User } from "firebase/auth";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Debug environment variables FIRST - this runs on both server and client
console.log('=== FIREBASE ENV DEBUG ===');
console.log('Node Environment:', process.env.NODE_ENV);
console.log('Environment Variables Check:');
console.log('NEXT_PUBLIC_API_KEY:', process.env.NEXT_PUBLIC_API_KEY ? 'EXISTS' : 'MISSING');
console.log('NEXT_PUBLIC_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_AUTH_DOMAIN ? 'EXISTS' : 'MISSING');
console.log('NEXT_PUBLIC_PROJECT_ID:', process.env.NEXT_PUBLIC_PROJECT_ID ? 'EXISTS' : 'MISSING');
console.log('NEXT_PUBLIC_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_STORAGE_BUCKET ? 'EXISTS' : 'MISSING');
console.log('NEXT_PUBLIC_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID ? 'EXISTS' : 'MISSING');
console.log('NEXT_PUBLIC_APP_ID:', process.env.NEXT_PUBLIC_APP_ID ? 'EXISTS' : 'MISSING');

// Show first few characters of each value for debugging (but not full values for security)
console.log('Partial Values (first 10 chars):');
console.log('API_KEY:', process.env.NEXT_PUBLIC_API_KEY?.substring(0, 10) || 'MISSING');
console.log('AUTH_DOMAIN:', process.env.NEXT_PUBLIC_AUTH_DOMAIN?.substring(0, 10) || 'MISSING');
console.log('PROJECT_ID:', process.env.NEXT_PUBLIC_PROJECT_ID?.substring(0, 10) || 'MISSING');
console.log('========================');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
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
    console.error('=== FIREBASE CONFIG ERROR ===');
    console.error('Missing Firebase configuration fields:', missingFields);
    console.error('Current config status:', {
      apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
      authDomain: firebaseConfig.authDomain ? 'Set' : 'Missing',
      projectId: firebaseConfig.projectId ? 'Set' : 'Missing',
      storageBucket: firebaseConfig.storageBucket ? 'Set' : 'Missing',
      messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'Missing',
      appId: firebaseConfig.appId ? 'Set' : 'Missing',
    });
    console.error('============================');
    throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
  } else {
    console.log('✅ All Firebase config fields are present');
  }
};

// Always validate config (both server and client side)
try {
  validateFirebaseConfig();
} catch (error) {
  console.error('Firebase config validation failed:', error);
}

// Initialize Firebase with proper types and error handling
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let analytics: Analytics | undefined;

if (typeof window !== 'undefined') {
  console.log('🔥 Initializing Firebase on client side...');
  try {
    // Re-validate on client side
    validateFirebaseConfig();
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log('✅ Firebase app and auth initialized successfully');
    
    // Initialize Analytics only in client-side
    isSupported().then((supported) => {
      if (supported && app) {
        analytics = getAnalytics(app);
        console.log('✅ Firebase Analytics initialized');
      } else {
        console.log('ℹ️ Firebase Analytics not supported or app not initialized');
      }
    }).catch((error) => {
      console.warn('⚠️ Analytics initialization failed:', error);
    });
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    // You might want to show a user-friendly error message here
  }
} else {
  console.log('🖥️ Running on server side - Firebase will initialize on client');
}

export { 
  app,
  auth, 
  onAuthStateChanged,
  analytics,
  type User
};