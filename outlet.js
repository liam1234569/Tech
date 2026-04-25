function renderOutletApp() {
    const container = document.querySelector("#app-outlet .app-content");
    if (!container) return;

    container.innerHTML = `
        <div class="glass-section">
            <h3>📦 XXL-Outlet (Bulk-Bestellungen)</h3>
            <p><small>Kaufe große Mengen und spare massiv pro Stück!</small></p>
            <div id="outlet-grid" class="shop-grid"></div>
        </div>
    `;

    const grid = document.getElementById("outlet-grid");
    // Wir zeigen nur die Standard-Produkte (keine Autos/Devices) im Outlet
    const bulkItems = wholesaleProducts.filter(p => !p.type);

    bulkItems.forEach(p => {
        const price100 = Math.floor((p.buy * 100) * 0.90);
        const price500 = Math.floor((p.buy * 500) * 0.80);
        const price1000 = Math.floor((p.buy * 1000) * 0.70);

        const card = document.createElement("div");
        card.className = "product-card glass-card blue-glow";
        card.style.flexDirection = "column";
        card.style.alignItems = "flex-start";
        card.innerHTML = `
            <strong>${p.name}</strong>
            <small>Einzelpreis Normal: ${p.buy}€</small>
            <hr style="width:100%; opacity:0.2; margin:10px 0;">
            
            <div class="bulk-option" style="width:100%; margin-bottom:8px;">
                <button class="action-btn small" onclick="buyBulk('${p.id}', 100, ${price100})" style="width:100%;">
                    100 Stk. für ${price100}€ <br>
                    <small>(${Math.floor(price100/100)}€/Stk - 10% Rabatt)</small>
                </button>
            </div>

            <div class="bulk-option" style="width:100%; margin-bottom:8px;">
                <button class="action-btn small" onclick="buyBulk('${p.id}', 500, ${price500})" style="width:100%; background:#5856d6;">
                    500 Stk. für ${price500}€ <br>
                    <small>(${Math.floor(price500/500)}€/Stk - 20% Rabatt)</small>
                </button>
            </div>

            <div class="bulk-option" style="width:100%;">
                <button class="action-btn small" onclick="buyBulk('${p.id}', 1000, ${price1000})" style="width:100%; background:#af52de;">
                    1000 Stk. für ${price1000}€ <br>
                    <small>(${Math.floor(price1000/1000)}€/Stk - 30% Rabatt)</small>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function buyBulk(id, amount, totalCost) {
    const p = wholesaleProducts.find(x => x.id === id);
    if (money >= totalCost) {
        money -= totalCost;
        stock[id] = (stock[id] || 0) + amount;
        log(`📦 OUTLET: ${amount}x ${p.name} geliefert! (-${totalCost}€)`);
        updateUI();
    } else {
        log("❌ Dein Geld reicht nicht für diese Großmenge!");
    }
}