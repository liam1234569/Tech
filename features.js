// --- BANK SYSTEM ---
let activeLoans = [];

const loanOffers = [
    { id: 1, amount: 5000, interest: 1.10, term: 10 },    // Zahlt 5500 zurück
    { id: 2, amount: 50000, interest: 1.15, term: 20 },   // Zahlt 57500 zurück
    { id: 3, amount: 150000, interest: 1.25, term: 30 }   // Zahlt 187500 zurück
];

function takeLoan(offerId) {
    const offer = loanOffers.find(o => o.id === offerId);
    money += offer.amount;
    activeLoans.push({
        amount: offer.amount * offer.interest,
        remaining: offer.amount * offer.interest,
        installment: (offer.amount * offer.interest) / offer.term
    });
    log(`🏦 Kredit über ${offer.amount}€ aufgenommen!`);
    renderBankApp();
    updateUI();
}

// Zins-Abbuchung alle 30 Sekunden
setInterval(() => {
    activeLoans.forEach((loan, index) => {
        if (loan.remaining > 0) {
            let payment = Math.min(loan.installment, loan.remaining);
            if (money >= payment) {
                money -= payment;
                loan.remaining -= payment;
                log(`💸 Kreditrate bezahlt: -${payment.toFixed(2)}€`);
            }
        }
    });
    activeLoans = activeLoans.filter(l => l.remaining > 0);
    updateUI();
}, 30000);

// --- AUTO HANDEL ---
const carMarket = [
    { id: 'van', name: 'Lieferwagen (Gebraucht)', price: 4000, boost: 5 },
    { id: 'truck', name: 'Logistik-LKW', price: 15000, boost: 15 },
    { id: 'sport', name: 'Firmen-Sportwagen', price: 80000, boost: 50 }
];

let myCars = [];

function buyCar(carId) {
    const car = carMarket.find(c => c.id === carId);
    if (money >= car.price) {
        money -= car.price;
        myCars.push(car);
        customerCount += car.boost; // Autos bringen Prestige/Logistik-Boost
        log(`🚗 ${car.name} gekauft! (+${car.boost} Besucher)`);
        renderCarApp();
        updateUI();
    } else {
        log("❌ Zu wenig Geld für dieses Auto!");
    }
}

// --- RENDER FUNKTIONEN ---
function renderBankApp() {
    const container = document.querySelector("#app-bank .app-content");
    if (!container) return;
    
    let html = `<h3>Kreditangebote</h3><div class="glass-section">`;
    loanOffers.forEach(o => {
        html += `
            <div class="glass-card blue-glow">
                <span><strong>${o.amount.toLocaleString()}€</strong><br><small>Zins: ${((o.interest-1)*100).toFixed(0)}%</small></span>
                <button class="action-btn small" onclick="takeLoan(${o.id})">Aufnehmen</button>
            </div>`;
    });
    html += `</div><h3>Deine Schulden</h3><div class="glass-section">`;
    activeLoans.forEach(l => {
        html += `<div class="glass-card active-item"><span>Restbetrag: ${l.remaining.toFixed(2)}€</span></div>`;
    });
    container.innerHTML = html + `</div>`;
}

// In features.js
function renderCarApp() {
    const container = document.querySelector("#app-cars .app-content");
    if (!container) return;
    
    // Hier rufen wir einfach die Schrottplatz-Ansicht auf
    let html = `
        <h3>🚗 Auto-Handel</h3>
        <p><small>Kaufe Fahrzeuge günstig auf und verkaufe sie in deinem Shop weiter.</small></p>
        <div id="scrapyard-list" class="shop-grid"></div>
    `;
    container.innerHTML = html;
    
    // Liste rendern
    const listDiv = container.querySelector("#scrapyard-list");
    const cars = wholesaleProducts.filter(p => p.type === "Car");
    
    cars.forEach(p => {
        const card = document.createElement("div");
        card.className = "glass-card blue-glow";
        card.style.flexDirection = "column";
        card.innerHTML = `
            <strong>${p.name}</strong>
            <span>Einkauf: ${p.buy}€</span>
            <button class="action-btn small" onclick="buyItem('${p.id}')">Holen</button>
        `;
        listDiv.appendChild(card);
    });
}