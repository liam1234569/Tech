// Speichert den kompletten Spielstand
async function saveGameData() {
    if (!currentUser) return;

    const gameData = {
        money: money,
        stock: stock,
        customerCount: customerCount,
        employees: employees,
        activeShopItems: activeShopItems,
        myPrices: myPrices,
        lastSave: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection("users").doc(currentUser.uid).set(gameData);
        console.log("Cloud-Save erfolgreich!");
    } catch (err) {
        console.error("Speicherfehler:", err);
    }
}

// Lädt den Spielstand beim Start
async function loadGameData() {
    if (!currentUser) return;

    try {
        const doc = await db.collection("users").doc(currentUser.uid).get();
        if (doc.exists) {
            const data = doc.data();
            money = data.money;
            stock = data.stock;
            customerCount = data.customerCount;
            employees = data.employees;
            activeShopItems = data.activeShopItems || [];
            myPrices = data.myPrices || {};
            
            log("☁️ Spielstand aus Cloud geladen.");
            updateUI();
        }
    } catch (err) {
        console.error("Ladefehler:", err);
    }
}

// Alle 30 Sekunden automatisch speichern
setInterval(() => {
    if (currentUser) saveGameData();
}, 30000);

// Diese Funktion lädt die Produkte, die DU als Admin erstellt hast
function loadGlobalProducts() {
    database.ref('global/products').on('value', (snapshot) => {
        const globalData = snapshot.val();
        if (globalData) {
            // Füge die Admin-Produkte zu den normalen wholesaleProducts hinzu
            Object.values(globalData).forEach(p => {
                if (!wholesaleProducts.find(x => x.id === p.id)) {
                    wholesaleProducts.push(p);
                }
            });
            console.log("🌍 Globale Admin-Produkte geladen.");
        }
    });
}

