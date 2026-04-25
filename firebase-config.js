// Deine persönlichen Zugangsdaten von der Firebase Console
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "tech-a74d4.firebaseapp.com",
  databaseURL: "https://tech-a74d4-default-rtdb.europe-west1.firebasedatabase.app", // Aus deinem Screenshot
  projectId: "tech-a74d4",
  storageBucket: "tech-a74d4.appspot.com",
  messagingSenderId: "DEINE_ID",
  appId: "DEINE_APP_ID"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();