// --- GLOBALE VARIABLEN ---
let money = 1000;
let stock = {};
let activeShopItems = [];
let myPrices = {};
let customerCount = 1;
let employees = 0;
loadGlobalProducts();
// --- APP STEUERUNG ---
// In der game.js die openApp Funktion anpassen:
function openApp(id) {
    const app = document.getElementById(id);
    if (!app) return;
    
    // Alle anderen Fenster nach hinten schieben, aktuelles nach vorn
    document.querySelectorAll('.app-window').forEach(win => win.style.zIndex = 100);
    app.style.zIndex = 101;
    
    app.style.display = "flex";
    
    // WELCHE APP WIRD GEÖFFNET? (Inhalt laden)
    if (id === 'app-wholesale') renderShop();
    if (id === 'app-marketing') renderMarketingApp();
    if (id === 'app-myshop') renderStorefront();
    if (id === 'app-mgmt') renderManagementApp();
    if (id === 'app-devices') renderDeviceShop();
    if (id === 'app-bank') renderBankApp();
    if (id === 'app-cars') renderCarApp();
    if (id === 'app-browser') renderBrowserApp();
    if (id === 'app-outlet') renderOutletApp();
    if (id === 'app-auth') renderAuthApp();
    
    updateUI();
}

function closeApp(id) {
    const app = document.getElementById(id);
    if (app) app.style.display = "none";
}

// --- SHOP LOGIK (AKTIVIEREN / DEAKTIVIEREN) ---
function listProductInShop(id) {
    if (!activeShopItems.includes(id)) {
        activeShopItems.push(id);
        log(`✅ Produkt ${id} ist jetzt ONLINE.`);
    }
    updateUI();
}

function delistProduct(id) {
    activeShopItems = activeShopItems.filter(item => item !== id);
    log(`❌ Produkt ${id} ist jetzt OFFLINE.`);
    updateUI();
}

function setPrice(id, val) {
    myPrices[id] = parseInt(val);
    log(`Preis für ${id} auf ${val}€ geändert.`);
}

// --- RENDER FUNKTIONEN (MODERNER GLAS-LOOK) ---

function renderStorefront() {
    const storeDiv = document.getElementById("storefront");
    if (!storeDiv) return;
    storeDiv.innerHTML = "";

    // SEKTION: LAGER (OFFLINE)
    let storageHTML = `<div class="glass-section"><h3>📦 Lager (Bereit zum Einstellen)</h3>`;
    let hasStorage = false;
    for (let id in stock) {
        if (stock[id] > 0 && !activeShopItems.includes(id)) {
            hasStorage = true;
            const p = wholesaleProducts.find(x => x.id === id);
            storageHTML += `
                <div class="glass-card blue-glow">
                    <div class="card-info">
                        <strong>${p ? p.name : id}</strong>
                        <span>Vorrätig: ${stock[id]}x</span>
                    </div>
                    <button class="action-btn small" onclick="listProductInShop('${id}')">In Shop stellen</button>
                </div>`;
        }
    }
    if (!hasStorage) storageHTML += "<p><small>Keine neue Ware im Lager.</small></p>";
    storageHTML += `</div>`;

    // SEKTION: AKTIVE ANGEBOTE
    let activeHTML = `<div class="glass-section"><h3>🛒 Aktive Angebote im Shop</h3>`;
    if (activeShopItems.length === 0) activeHTML += "<p><small>Dein Shop ist momentan leer.</small></p>";
    
    activeShopItems.forEach(id => {
        const p = wholesaleProducts.find(x => x.id === id);
        if (p) {
            const price = myPrices[id] || Math.floor(p.buy * 1.5);
            const quantity = stock[id] || 0;
            const statusColor = quantity > 0 ? "#34c759" : "#ff3b30";
            
            activeHTML += `
                <div class="glass-card active-item">
                    <div class="card-info">
                        <strong>${p.name}</strong>
                        <span style="color:${statusColor}; font-size: 11px;">● Lager: ${quantity}x</span>
                    </div>
                    <div class="card-actions">
                        <input type="number" value="${price}" onchange="setPrice('${id}', this.value)" style="width:50px; padding:2px; border-radius:4px; border:1px solid #ccc;"> €
                        <button class="close-btn-small" onclick="delistProduct('${id}')">×</button>
                    </div>
                </div>`;
        }
    });
    activeHTML += `</div>`;

    storeDiv.innerHTML = storageHTML + activeHTML;
}

function renderManagementApp() {
    const container = document.querySelector("#app-mgmt .app-content");
    if (!container) return;
    
    const statusText = employeesPaused ? 
        "<span style='color:#ff3b30'>PAUSIERT</span>" : 
        "<span style='color:#34c759'>AKTIV</span>";
    
    container.innerHTML = `
        <div class="glass-section">
            <h3>📈 Marketing & Wachstum</h3>
            <button class="action-btn" onclick="runAd()">📢 Werbung schalten (250€)</button>
            <p><small>Aktuelles Besucher-Level: ${customerCount}</small></p>
        </div>
        
        <hr>

        <div class="glass-section">
            <h3>👨‍💼 Personalverwaltung</h3>
            <div class="glass-card blue-glow" style="flex-direction: column; align-items: flex-start;">
                <span>Angestellte Einkäufer: <strong>${employees}</strong></span>
                <span>Status: ${statusText}</span>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="action-btn" style="flex: 1;" onclick="hireEmployee()">Einstellen (600€)</button>
                <button class="action-btn" style="flex: 1; background: ${employeesPaused ? '#34c759' : '#ff9500'}" 
                        onclick="toggleEmployeesPause()">
                    ${employeesPaused ? '▶️ Aktivieren' : '⏸️ Pause'}
                </button>
            </div>
        </div>
    `;
}

function renderMarketingApp() {
    const container = document.querySelector("#app-marketing .app-content");
    if (!container) return;

    let html = `
        <h3>Influencer Kooperationen</h3>
        <button class="action-btn" onclick="startInfluencerPromo('tiktok')">TikTok-Hype (500€)</button>
        <button class="action-btn" onclick="startInfluencerPromo('youtube')">YouTube-Review (1500€)</button>
        <hr>
        <h3>Produkt-Release Event</h3>
    `;

    if (releaseTimer > 0) {
        html += `
            <div style="background: rgba(255, 149, 0, 0.2); border: 1px solid #ff9500; color: #ff9500; padding: 15px; border-radius: 12px; text-align:center;">
                <div style="font-size: 14px; font-weight: bold; text-transform: uppercase;">Launch Countdown</div>
                <div style="font-size: 32px; font-weight: bold;">${releaseTimer}s</div>
                <small>Stelle sicher, dass genug Ware im Lager ist!</small>
            </div>`;
    } else {
        html += `<p><small>Wähle ein Produkt für einen massiven Ansturm (300€ Gebühr):</small></p>`;
        let hasItems = false;
        for (let id in stock) {
            if (stock[id] > 0) {
                hasItems = true;
                const p = wholesaleProducts.find(x => x.id === id);
                html += `
                    <button class="action-btn" style="background:#007aff; margin-bottom:8px; display:block; width:100%;" onclick="scheduleRelease('${id}')">
                        ${p ? p.name : id} releasen (${stock[id]}x vorrätig)
                    </button>`;
            }
        }
        if (!hasItems) html += "<p><small style='color:red;'>Keine Ware im Lager für ein Release!</small></p>";
    }
    container.innerHTML = html;
}

// --- ALLGEMEINES UI UPDATE ---
function updateUI() {
    // Topbar Daten
    const moneyEl = document.getElementById("money");
    if(moneyEl) moneyEl.innerText = money;
    
    const custEl = document.getElementById("customers");
    if(custEl) custEl.innerText = customerCount;
    
    const empEl = document.getElementById("employees");
    if(empEl) empEl.innerText = employees;

    // Einfache Lagerliste (für die Lager App)
    const stockList = document.getElementById("stockList");
    const stockCount = document.getElementById("stockCount");
    if (stockList) {
        stockList.innerHTML = "";
        let total = 0;
        for (let id in stock) {
            if (stock[id] > 0) {
                const p = wholesaleProducts.find(x => x.id === id);
                const li = document.createElement("li");
                li.innerText = `${p ? p.name : id}: ${stock[id]}x`;
                stockList.appendChild(li);
                total += stock[id];
            }
        }
        if(stockCount) stockCount.innerText = total;
    }
    
    // Immer mitsynchronisieren
    renderStorefront();
}

// --- LOG SYSTEM ---
function log(msg) {
    const l = document.getElementById("log");
    if (l) {
        l.innerHTML = `<div class="log-entry"><span>></span> ${msg}</div>` + l.innerHTML;
        // Optional: Behalte nur die letzten 20 Logs
        if (l.childNodes.length > 20) {
            l.removeChild(l.lastChild);
        }
    }
}

// Initialer Aufruf
window.onload = function() {
    updateUI();
};
