function customerTick() {
    if (typeof activeShopItems === 'undefined') return;

    // Wie viele Besucher kommen? (Beeinflusst durch releaseHype)
    let visitors = Math.floor((Math.random() * (customerCount + 3)) * releaseHype) + 1;

    for (let i = 0; i < visitors; i++) {
        let id;
        
        // RELEASE-LOGIK: 80% der Kunden wollen das Hype-Produkt, wenn es da ist
        if (currentReleaseItem && stock[currentReleaseItem] > 0 && Math.random() < 0.8) {
            id = currentReleaseItem;
        } else {
            // Normaler Kauf aus allen aktiven Produkten
            let itemsForSale = activeShopItems.filter(itemId => stock[itemId] > 0);
            if (itemsForSale.length === 0) break;
            id = itemsForSale[Math.floor(Math.random() * itemsForSale.length)];
        }

        let p = wholesaleProducts.find(x => x.id === id);
        let price = myPrices[id] || (p.buy * 1.5);

        // Preis-Check
        let markup = price / p.buy; 
        let buyChance = 0;
        if (markup <= 1.51) buyChance = 0.85; 
        else if (markup <= 2.5) buyChance = 0.35;
        else buyChance = 0.02;

        if (Math.random() < buyChance) {
            if (stock[id] > 0) {
                stock[id]--;
                money += price;
                log(`🛒 VERKAUFT: ${p.name} für ${price}€!`);
            }
        }
    }
    updateUI();
}

setInterval(customerTick, 3000);