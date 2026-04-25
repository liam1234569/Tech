const categories = [
    { name: "CPU", base: 100 },
    { name: "GPU", base: 250 },
    { name: "RAM", base: 50 },
    { name: "Akku", base: 40 }
];

let wholesaleProducts = [];

// Generiere 1 bis 5 Sterne Produkte
categories.forEach(cat => {
    for (let s = 1; s <= 5; s++) {
        wholesaleProducts.push({
            id: `${cat.name.toLowerCase()}_${s}`,
            name: `${cat.name} V.${s}`,
            rating: "⭐".repeat(s),
            stars: s,
            buy: cat.base * s
        });
    }
});

function renderShop() {
    const shopDiv = document.getElementById("shop");
    shopDiv.innerHTML = "";
    wholesaleProducts.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div style="font-size:24px;">📦</div>
            <strong>${p.name}</strong><br>
            <span style="color:#ff9500;">${p.rating}</span><br>
            <small>Einkauf: ${p.buy}€</small><br>
            <button onclick="buyItem('${p.id}')">Bestellen</button>
        `;
        shopDiv.appendChild(card);
    });
}

function buyItem(id) {
    const p = wholesaleProducts.find(x => x.id === id);
    if (money >= p.buy) {
        money -= p.buy;
        stock[id] = (stock[id] || 0) + 1;
        log(`Amazon Business: ${p.name} wurde geliefert.`);
        updateUI();
    } else {
        log(`❌ Nicht genug Geld für ${p.name}!`);
    }
}
// Einfach zu wholesaleProducts hinzufügen
wholesaleProducts.push(
    { id: "phone_x", name: "iPhone 15 Clone", type: "Device", buy: 800, rating: "⭐⭐⭐⭐⭐" },
    { id: "pc_ultra", name: "Gaming PC High-End", type: "Device", buy: 1500, rating: "⭐⭐⭐⭐⭐" },
    { id: "laptop_air", name: "TechBook Air", type: "Device", buy: 1100, rating: "⭐⭐⭐⭐" }
);

// Am Ende der shop.js hinzufügen oder ersetzen:
function renderDeviceShop() {
    const devDiv = document.getElementById("device-shop");
    if (!devDiv) return;
    devDiv.innerHTML = "";
    
    const devices = wholesaleProducts.filter(p => p.type === "Device");
    devices.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card glass-card blue-glow";
        card.innerHTML = `
            <div style="font-size:24px;">📱</div>
            <strong>${p.name}</strong><br>
            <small>Einkauf: ${p.buy}€</small><br>
            <button class="action-btn small" onclick="buyItem('${p.id}')">Bestellen</button>
        `;
        devDiv.appendChild(card);
    });
}

// Füge dies am Ende deiner shop.js hinzu:
const carDeals = [
    { id: "car_rust", name: "Rostiger Kleinwagen", type: "Car", buy: 1200, rating: "⭐" },
    { id: "car_van", name: "Alter Lieferwagen", type: "Car", buy: 3500, rating: "⭐⭐" },
    { id: "car_sedan", name: "Firmen-Limousine (Defekt)", type: "Car", buy: 8000, rating: "⭐⭐⭐" },
    { id: "car_sport", name: "Sportwagen (Unfall)", type: "Car", buy: 25000, rating: "⭐⭐⭐⭐" }
];

// Die Autos in den Großhandel mischen
wholesaleProducts.push(...carDeals);

// Falls du eine eigene App für den Schrottplatz willst, hier die Render-Funktion:
function renderCarScrapyard() {
    const devDiv = document.getElementById("device-shop"); // Wir nutzen den Grid-Container
    if (!devDiv) return;
    devDiv.innerHTML = "<h3>🚗 Firmen-Schrottplatz (Einkauf)</h3>";
    
    const cars = wholesaleProducts.filter(p => p.type === "Car");
    cars.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card glass-card blue-glow";
        card.innerHTML = `
            <div style="font-size:24px;">🔧</div>
            <strong>${p.name}</strong><br>
            <small>Zustand: ${p.rating}</small><br>
            <small>EK-Preis: ${p.buy}€</small><br>
            <button class="action-btn small" onclick="buyItem('${p.id}')">Aufkaufen</button>
        `;
        devDiv.appendChild(card);
    });
}