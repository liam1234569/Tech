// --- ADMIN LOGIN DATEN ---
const ADMIN_USER = "admin";
const ADMIN_PIN = "1337";
let isAdminLoggedIn = false;

// --- EASTER EGGS SPEICHER ---
let easterEggs = {
    "geldregen": () => { money += 1000000; log("💰 CHEAT: 1 Million Euro erhalten!"); updateUI(); },
    "hype": () => { customerCount += 100; log("🔥 CHEAT: Massiver Besucher-Ansturm!"); updateUI(); },
    "secret": "https://www.google.com"
};

// --- FUNKTIONEN ---
function openAdminPanel() {
    if (!isAdminLoggedIn) {
        let user = prompt("Admin Benutzername:");
        let pin = prompt("Admin PIN:");

        if (user === ADMIN_USER && pin === ADMIN_PIN) {
            isAdminLoggedIn = true;
            document.getElementById("admin-modal").style.display = "flex";
            renderAdminDashboard();
        } else {
            alert("Zugriff verweigert! Falsche Daten.");
        }
    } else {
        document.getElementById("admin-modal").style.display = "flex";
        renderAdminDashboard();
    }
}

function closeAdminPanel() {
    document.getElementById("admin-modal").style.display = "none";
}

function renderAdminDashboard() {
    const content = document.getElementById("admin-content");
    content.innerHTML = `
        <div class="glass-section" style="color: black;">
            <h3>🛠 Admin Kontrollzentrum</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h4>Produkt hinzufügen</h4>
                    <input type="text" id="adm-name" placeholder="Name (z.B. Super CPU)">
                    <input type="number" id="adm-price" placeholder="Preis (EK)">
                    <input type="text" id="adm-id" placeholder="ID (einzigartig)">
                    <button class="action-btn" onclick="adminAddProduct()">Erstellen</button>
                </div>
                <div>
                    <h4>Produkt entfernen</h4>
                    <select id="adm-remove-list" style="width:100%; padding:5px;"></select>
                    <button class="action-btn" style="background:#ff3b30;" onclick="adminRemoveProduct()">Löschen</button>
                </div>
            </div>
            <hr>
            <h4>Easter Egg im Browser erstellen</h4>
            <input type="text" id="ee-key" placeholder="Suchwort (z.B. 'geheim')">
            <input type="text" id="ee-val" placeholder="Link oder Aktion">
            <button class="action-btn" onclick="addEasterEgg()">Egg einbauen</button>
        </div>
    `;

    // Dropdown füllen
    const select = document.getElementById("adm-remove-list");
    wholesaleProducts.forEach(p => {
        let opt = document.createElement("option");
        opt.value = p.id;
        opt.innerText = p.name;
        select.appendChild(opt);
    });
}

function adminAddProduct() {
    const name = document.getElementById("adm-name").value;
    const price = parseInt(document.getElementById("adm-price").value);
    const id = document.getElementById("adm-id").value;

    if (name && price && id) {
        const newProduct = { id, name, buy: price, rating: "⭐⭐⭐⭐⭐ (Admin)", stars: 5 };
        
        // Speichert es global für JEDEN Spieler
        database.ref('global/products/' + id).set(newProduct); 
        
        log(`🛠 Admin: ${name} wurde für ALLE Spieler veröffentlicht.`);
        renderAdminDashboard();
    }
}

function adminRemoveProduct() {
    const id = document.getElementById("adm-remove-list").value;
    wholesaleProducts = wholesaleProducts.filter(p => p.id !== id);
    log(`🛠 Admin: Produkt ${id} entfernt.`);
    renderAdminDashboard();
}

function addEasterEgg() {
    const key = document.getElementById("ee-key").value.toLowerCase();
    const val = document.getElementById("ee-val").value;
    if (key && val) {
        easterEggs[key] = val;
        log(`🥚 Easter Egg für '${key}' eingebaut.`);
    }
}
