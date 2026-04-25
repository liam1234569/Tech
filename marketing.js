let releaseHype = 1.0; 
let currentReleaseItem = null; 
let releaseTimer = 0;

function startInfluencerPromo(platform) {
    let cost = platform === 'tiktok' ? 500 : 1500;
    
    if (money >= cost) {
        money -= cost;
        
        // Der Boost: TikTok gibt +5, YouTube +15 auf das Besucher-Level
        let boost = platform === 'tiktok' ? 5 : 15;
        customerCount += boost;
        
        log(`🎬 Kooperation mit ${platform.toUpperCase()} gestartet! (+${boost} Besucher)`);
        
        // Wir müssen das UI sofort updaten, damit die neue Besucherzahl oben steht
        updateUI();

        // Nach 60 Sekunden ist der Hype vorbei
        setTimeout(() => {
            customerCount -= boost;
            if (customerCount < 1) customerCount = 1; // Sicherheitshalber nie unter 1
            log(`📉 Der Hype von ${platform} ist abgeklungen.`);
            updateUI();
        }, 60000);

    } else {
        log(`❌ Du hast nicht genug Geld (${cost}€ benötigt) für ${platform}!`);
    }
}

function scheduleRelease(productId) {
    if (money < 300) {
        log("❌ Zu wenig Geld für ein Release-Event!");
        return;
    }
    if (releaseTimer > 0) {
        log("⚠️ Es läuft bereits ein Release!");
        return;
    }

    let priceInput = prompt("Verkaufspreis für den Hype festlegen:", "500");
    let targetPrice = parseInt(priceInput);
    if (isNaN(targetPrice) || targetPrice <= 0) return;

    money -= 300;
    currentReleaseItem = productId;
    myPrices[productId] = targetPrice;
    releaseTimer = 120;

    log(`📢 Vorbereitung läuft! ${productId} wird für ${targetPrice}€ gelauncht.`);

    let timerId = setInterval(() => {
        releaseTimer--;
        releaseHype = 2.0;

        if (releaseTimer <= 0) {
            clearInterval(timerId);
            launchProduct(productId);
        }
        if (document.getElementById('app-marketing').style.display === 'flex') renderMarketingApp();
        updateUI();
    }, 1000);
}

function launchProduct(productId) {
    log(`🚀 RELEASE-TAG! Die Leute stürmen den Laden für ${productId}!`);
    if (!activeShopItems.includes(productId)) activeShopItems.push(productId);
    releaseHype = 12.0; // Mega Boost

    let checkStock = setInterval(() => {
        if (stock[productId] <= 0) {
            log("📉 Hype vorbei: Produkt ausverkauft!");
            releaseHype = 1.0;
            currentReleaseItem = null;
            clearInterval(checkStock);
            updateUI();
        }
    }, 1000);

    setTimeout(() => {
        releaseHype = 1.0;
        currentReleaseItem = null;
        clearInterval(checkStock);
    }, 60000); // Maximal 60 Sek Hype
}