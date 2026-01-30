// ========== CONFIGURACIÓN DE FIREBASE ==========
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8sN_BdZFNe_eClhPcbo70JIktyz3PD3o",
  authDomain: "ministerio-poder-oracion.firebaseapp.com",
  projectId: "ministerio-poder-oracion",
  storageBucket: "ministerio-poder-oracion.firebasestorage.app",
  messagingSenderId: "246160091039",
  appId: "1:246160091039:web:81b4fbc95f317c34907faa"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
