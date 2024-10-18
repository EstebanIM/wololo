import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDbW1j6uwoTfz8y53Wy7bcUT0FPAtLwc3o",
  authDomain: "inventario-29857.firebaseapp.com",
  projectId: "inventario-29857",
  storageBucket: "inventario-29857.appspot.com",
  messagingSenderId: "443657501888",
  appId: "1:443657501888:web:d69a6c79b2c984b68f0125",
  measurementId: "G-J9T3LZYEV1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };