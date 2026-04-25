// HIER MUSST DU DEINE DATEN VON GOOGLE FIREBASE EINTRAGEN
const firebaseConfig = {
    apiKey: "DEIN_API_KEY",
    authDomain: "DEIN_PROJEKT.firebaseapp.com",
    projectId: "DEIN_PROJEKT",
    storageBucket: "DEIN_PROJEKT.appspot.com",
    messagingSenderId: "DEINE_ID",
    appId: "DEINE_APP_ID"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// UI für das Login-Fenster
function renderAuthApp() {
    const container = document.getElementById("auth-content");
    if (!currentUser) {
        container.innerHTML = `
            <h3>Anmelden / Registrieren</h3>
            <input type="email" id="auth-email" placeholder="E-Mail" style="display:block; margin: 10px auto; padding: 8px; width: 80%;">
            <input type="password" id="auth-pw" placeholder="Passwort" style="display:block; margin: 10px auto; padding: 8px; width: 80%;">
            <button class="action-btn" onclick="handleLogin()">Login</button>
            <button class="action-btn" style="background:#5856d6;" onclick="handleRegister()">Registrieren</button>
        `;
    } else {
        container.innerHTML = `
            <h3>Willkommen, ${currentUser.email}</h3>
            <p>Dein Spielstand wird automatisch in der Cloud gesichert.</p>
            <button class="action-btn" style="background:#ff3b30;" onclick="handleLogout()">Abmelden</button>
        `;
    }
}

async function handleRegister() {
    const email = document.getElementById("auth-email").value;
    const pw = document.getElementById("auth-pw").value;
    try {
        await auth.createUserWithEmailAndPassword(email, pw);
        log("✅ Account erfolgreich erstellt!");
    } catch (err) {
        alert("Fehler: " + err.message);
    }
}

async function handleLogin() {
    const email = document.getElementById("auth-email").value;
    const pw = document.getElementById("auth-pw").value;
    try {
        await auth.signInWithEmailAndPassword(email, pw);
        log("🔓 Willkommen zurück!");
    } catch (err) {
        alert("Login fehlgeschlagen!");
    }
}

function handleLogout() {
    auth.signOut();
    location.reload(); // Seite neu laden zum Zurücksetzen
}

// Beobachtet, ob ein User eingeloggt ist
auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
        document.getElementById("account-btn").innerText = "👤 " + user.email.split('@')[0];
        loadGameData(); // Daten aus Cloud laden
    } else {
        document.getElementById("account-btn").innerText = "👤 Account";
    }
    renderAuthApp();
});