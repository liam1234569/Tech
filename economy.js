let employeesPaused = false;

function runAd() {
    if (money >= 250) {
        money -= 250;
        customerCount++; 
        log("📢 Werbung geschaltet! Mehr Kunden kommen.");
        if (document.getElementById('app-mgmt').style.display === 'flex') renderManagementApp();
        updateUI();
    } else {
        log("❌ Nicht genug Geld für Werbung!");
    }
}

function hireEmployee() {
    if (money >= 600) {
        money -= 600;
        employees++;
        log("👨‍💼 Einkäufer eingestellt!");
        if (document.getElementById('app-mgmt').style.display === 'flex') renderManagementApp();
        updateUI();
    } else {
        log("❌ Nicht genug Geld für Personal!");
    }
}

function toggleEmployeesPause() {
    if (employees <= 0) return;
    employeesPaused = !employeesPaused;
    log(employeesPaused ? "⏸️ Mitarbeiter machen Pause." : "▶️ Mitarbeiter arbeiten wieder.");
    renderManagementApp();
    updateUI();
}

// Automatischer Einkauf
setInterval(() => {
    if (employees > 0 && !employeesPaused) {
        wholesaleProducts.forEach(p => {
            if ((stock[p.id] || 0) < 5 && money >= p.buy) {
                money -= p.buy;
                stock[p.id] = (stock[p.id] || 0) + 1;
                log(`👨‍💼 Nachkauf: ${p.name}`);
                updateUI();
            }
        });
    }
}, 10000);