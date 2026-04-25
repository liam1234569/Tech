const firebaseConfig = {
  apiKey: "AIzaSyBN8UBCAZ9Z_eVpVufUn8E_pgu-ygqa_NQ",
  authDomain: "tech-a74d4.firebaseapp.com",
  databaseURL: "https://tech-a74d4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tech-a74d4",
  storageBucket: "tech-a74d4.firebasestorage.app",
  messagingSenderId: "111571920796",
  appId: "1:111571920796:web:700fa92ffa3b7c64d10a59"
};


// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
