// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDk5ecY5F5UtkC9c385p-ySVLxjNUG8wIw",
  authDomain: "juego-mruv-cd317.firebaseapp.com",
  databaseURL: "https://juego-mruv-cd317-default-rtdb.firebaseio.com",
  projectId: "juego-mruv-cd317",
  storageBucket: "juego-mruv-cd317.firebasestorage.app",
  messagingSenderId: "78539737534",
  appId: "1:78539737534:web:2bc8fcfbc5d24a9c0511ef",
  measurementId: "G-M8P1R1810M"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
