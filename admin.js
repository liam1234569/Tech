/**
 * admin.js - Zentrale Steuerung für Admin-Rechte, 
 * globale Produkte und Easter-Egg-Management.
 */

// --- ADMIN KONFIGURATION ---
const ADMIN_USER = "admin";
const ADMIN_PIN = "1337";
let isAdminLoggedIn = false;

// --- EASTER EGGS SPEICHER (Lokal initialisiert) ---
let easterEggs = {
    "geldregen": () => { money += 1000000; log("💰 CHEAT: 1 Million Euro erhalten!"); updateUI(); },
    "hype": () => { customerCount += 100; log("🔥 CHEAT: Massiver Besucher-Ansturm!"); updateUI(); }
};

// --- CORE FUNKTIONEN ---

function openAdminPanel() {
    if (!isAdminLoggedIn) {
        let user = prompt("Admin Benutzername:");
        let pin = prompt("Admin PIN:");

        if (user === ADMIN_USER && pin === ADMIN_PIN) {
            isAdminLoggedIn = true;
            document.getElementById("admin-modal").style.display = "flex";
            renderAdminDashboard();
            log("🛠 Admin-Modus aktiviert.");
        } else {
            alert("Zugriff verweigert!");
        }
    } else {
        document.getElementById("admin-modal").style.display = "flex";
        renderAdminDashboard();
    }
}

function closeAdminPanel() {
    document.getElementById("admin-modal").style.display = "none";
}

// --- DASHBOARD RENDERING ---

function renderAdminDashboard() {
    const content = document.getElementById("admin-content");
    if (!content) return;

    content.innerHTML = `
        <div class="glass-section" style="color: black; padding: 15px;">
            <h3 style="margin-top:0;">🛠 Admin Kontrollzentrum</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div style="background: #f0f0f0; padding: 10px; border-radius: 8px;">
                    <h4>📦 Globales Produkt hinzufügen</h4>
                    <input type="text" id="adm-name" placeholder="Name (z.B. iPhone 16)" style="width:90%; margin-bottom:5px;">
                    <input type="number" id="adm-price" placeholder="Einkaufspreis" style="width:90%; margin-bottom:5px;">
                    <input type="text" id="adm-id" placeholder="Eindeutige ID (z.B. ip16)" style="width:90%; margin-bottom:5px;">
                    <button class="action-btn" onclick="adminAddProduct()" style="width:100%;">Global Veröffentlichen</button>
                </div>
                
                <div style="background: #f0f0f0; padding: 10px; border-radius: 8px;">
                    <h4>🗑 Produkt entfernen</h4>
                    <select id="adm-remove-list" style="width:100%; padding:8px; margin-bottom:5px;"></select>
                    <button class="action-btn" style="background:#ff3b30; width:100%;" onclick="adminRemoveProduct()">Aus Shop löschen</button>
                </div>
            </div>

            <hr style="opacity: 0.2;">

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: #f0f0f0; padding: 10px; border-radius: 8px;">
                    <h4>🥚 Easter Egg erstellen</h4>
                    <input type="text" id="ee-key" placeholder="Suchwort (z.B. 'geheim')" style="width:90%; margin-bottom:5px;">
                    <input type="text" id="ee-val" placeholder="Link oder Funktion" style="width:90%; margin-bottom:5px;">
                    <button class="action-btn" onclick="addEasterEgg()" style="width:100%; background:#5856d6;">Egg einbauen</button>
                </div>

                <div style="background: #f0f0f0; padding: 10px; border-radius: 8px;">
                    <h4>📜 Aktive Geheimnisse</h4>
                    <div id="ee-list" style="max-height: 120px; overflow-y: auto; background: white; padding: 5px; border-radius: 4px; border: 1px solid #ddd;">
                        </div>
                </div>
            </div>
        </div>
    `;

    // Listen füllen
    updateAdminLists();
}

function updateAdminLists() {
    // Produkte Dropdown
    const select = document.getElementById("adm-remove-list");
    if (select) {
        select.innerHTML = "";
        wholesaleProducts.forEach(p => {
            let opt = document.createElement("option");
            opt.value = p.id;
            opt.innerText = p.name;
            select.appendChild(opt);
        });
    }

    // Easter Egg Liste mit Lösch-Buttons
    const eeList = document.getElementById("ee-list");
    if (eeList) {
        eeList.innerHTML = "";
        Object.keys(easterEggs).forEach(key => {
            const div = document.createElement("div");
            div.style = "display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding:3px 0;";
            div.innerHTML = `
                <span style="font-size:12px;"><b>${key}</b></span>
                <button onclick="removeEasterEgg('${key}')" style="background:#ff3b30; color:white; border:none; border-radius:3px; cursor:pointer; padding:2px 6px; font-size:10px;">Löschen</button>
            `;
            eeList.appendChild(div);
        });
    }
}

// --- AKTIONEN ---

function adminAddProduct() {
    const name = document.getElementById("adm-name").value;
    const price = parseInt(document.getElementById("adm-price").value);
    const id = document.getElementById("adm-id").value;

    if (name && price && id) {
        const newProduct = { id, name, buy: price, rating: "⭐⭐⭐⭐⭐ (Admin)", stars: 5 };
        
        // Lokal hinzufügen
        wholesaleProducts.push(newProduct);
        
        // Global in Firebase speichern (falls database initialisiert)
        if (typeof database !== 'undefined') {
            database.ref('global/products/' + id).set(newProduct);
        }
        
        log(`🛠 Admin: "${name}" wurde global hinzugefügt.`);
        renderAdminDashboard();
    }
}

function adminRemoveProduct() {
    const id = document.getElementById("adm-remove-list").value;
    wholesaleProducts = wholesaleProducts.filter(p => p.id !== id);
    
    // Global in Firebase löschen
    if (typeof database !== 'undefined') {
        database.ref('global/products/' + id).remove();
    }
    
    log(`🛠 Admin: Produkt mit ID ${id} entfernt.`);
    renderAdminDashboard();
}

function addEasterEgg() {
    const key = document.getElementById("ee-key").value.toLowerCase().trim();
    const val = document.getElementById("ee-val").value;
    if (key && val) {
        easterEggs[key] = val;
        log(`🥚 Admin: Easter Egg '${key}' wurde aktiviert.`);
        renderAdminDashboard();
    }
}

function removeEasterEgg(key) {
    if (confirm(`Soll das Geheimnis "${key}" gelöscht werden?`)) {
        delete easterEggs[key];
        log(`🥚 Admin: Easter Egg '${key}' entfernt.`);
        renderAdminDashboard();
    }
}
