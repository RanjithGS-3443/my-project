import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCR_b391kQ5toRavTY0PtCT7oCX5ntZe_Q",
  authDomain: "helpai-d614c.firebaseapp.com",
  projectId: "helpai-d614c",
  storageBucket: "helpai-d614c.firebasestorage.app",
  messagingSenderId: "207596362596",
  appId: "1:207596362596:web:12b4b67e858c63520b7871",
  measurementId: "G-N2L824G4Z7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
