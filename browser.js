/**
 * browser.js - Die Web-Browser App für Tech OS
 * Inklusive Google-Design und Easter-Egg-System
 */

function renderBrowserApp() {
    const container = document.querySelector("#app-browser .app-content");
    if (!container) return;

    // Das Design der Browser-Startseite (Google Style)
    container.innerHTML = `
        <div style="text-align: center; padding-top: 60px; font-family: 'Arial', sans-serif; background: white; min-height: 100%;">
            <h1 style="font-size: 70px; margin-bottom: 30px; letter-spacing: -3px; font-weight: bold;">
                <span style="color: #4285F4">T</span>
                <span style="color: #EA4335">e</span>
                <span style="color: #FBBC05">c</span>
                <span style="color: #4285F4">h</span>
                <span style="color: #34A853">G</span>
                <span style="color: #EA4335">oogle</span>
            </h1>

            <div style="margin-bottom: 20px;">
                <div style="position: relative; width: 70%; margin: 0 auto;">
                    <input type="text" id="browser-search-input" placeholder="Suche im Tech-Netz oder gib einen Befehl ein..." 
                        style="width: 100%; padding: 14px 25px 14px 45px; border-radius: 30px; border: 1px solid #dfe1e5; 
                        box-shadow: 0 1px 6px rgba(32,33,36,0.2); outline: none; font-size: 16px;">
                    <span style="position: absolute; left: 15px; top: 15px; color: #9aa0a6;">🔍</span>
                </div>
            </div>

            <div style="margin-top: 25px;">
                <button class="action-btn" style="background: #f8f9fa; color: #3c4043; border: 1px solid #f8f9fa; padding: 10px 20px; border-radius: 4px; margin-right: 10px; cursor: pointer;" 
                    onclick="const q = document.getElementById('browser-search-input').value; performSearch(q)">Tech-Suche</button>
                <button class="action-btn" style="background: #f8f9fa; color: #3c4043; border: 1px solid #f8f9fa; padding: 10px 20px; border-radius: 4px; cursor: pointer;"
                    onclick="log('Browser: Du fühlst dich glücklich!')">Auf gut Glück!</button>
            </div>

            <div id="search-results" style="text-align: left; width: 70%; margin: 30px auto 0 auto; padding-bottom: 50px;">
                </div>
        </div>
    `;

    // Event-Listener für die ENTER-Taste
    const input = document.getElementById("browser-search-input");
    input.focus(); // Direkt ins Suchfeld springen
    input.addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            performSearch(input.value);
        }
    });
}

function performSearch(query) {
    const resultsDiv = document.getElementById("search-results");
    if (!resultsDiv || !query) return;

    const q = query.toLowerCase().trim();
    resultsDiv.innerHTML = `<p style="color: #70757a; font-size: 14px;">Ungefähr ${Math.floor(Math.random() * 1000000)} Ergebnisse für "${query}"</p>`;

    // 1. ÜBERPRÜFUNG AUF EASTER EGGS / ADMIN CHEATS
    // Diese kommen aus der admin.js (z.B. geldregen, hype)
    if (typeof easterEggs !== 'undefined' && easterEggs[q]) {
        const egg = easterEggs[q];
        
        if (typeof egg === 'function') {
            egg(); // Führt den Cheat aus
            resultsDiv.innerHTML += `
                <div style="background: #fdf2ff; border: 1px solid #af52de; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <strong style="color: #af52de;">✨ System-Befehl erkannt!</strong><br>
                    <span style="color: #4d5156;">Der Befehl "${q}" wurde erfolgreich ausgeführt.</span>
                </div>`;
        } else {
            // Wenn das Easter Egg ein Link ist
            resultsDiv.innerHTML += `
                <div style="margin-bottom: 25px;">
                    <div style="color: #1a0dab; font-size: 20px; text-decoration: underline; cursor: pointer;" onclick="window.open('${egg}', '_blank')">
                        Geheimer Link gefunden: ${q}
                    </div>
                    <div style="color: #006621; font-size: 14px;">${egg}</div>
                    <div style="color: #4d5156; font-size: 14px;">Du hast ein verstecktes Easter Egg entdeckt!</div>
                </div>`;
        }
        return; // Suche beenden, wenn ein Easter Egg gefunden wurde
    }

    // 2. NORMALE PRODUKTSUCHE (durchsucht alle Produkte im Spiel)
    const items = wholesaleProducts.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.type && p.type.toLowerCase().includes(q))
    );

    if (items.length > 0) {
        items.forEach(item => {
            const productUrl = `tech-os://produkte/${item.id}`;
            resultsDiv.innerHTML += `
                <div style="margin-bottom: 25px; font-family: 'Arial', sans-serif;">
                    <div style="color: #006621; font-size: 14px;">${productUrl}</div>
                    <div style="color: #1a0dab; font-size: 20px; cursor: pointer; text-decoration: none;" 
                         onmouseover="this.style.textDecoration='underline'" 
                         onmouseout="this.style.textDecoration='none'"
                         onclick="log('Browser: ${item.name} im Verzeichnis aufgerufen.')">
                        ${item.name} - ${item.rating || '⭐⭐⭐⭐'}
                    </div>
                    <div style="color: #4d5156; font-size: 14px; line-height: 1.4;">
                        Aktueller Einkaufspreis bei Amazon Business: <strong>${item.buy}€</strong>. 
                        Produkttyp: ${item.type || 'Standard Hardware'}. Jetzt im Großhandel verfügbar.
                    </div>
                </div>
            `;
        });
    } else {
        // 3. KEINE ERGEBNISSE
        resultsDiv.innerHTML += `
            <div style="margin-top: 30px;">
                <p>Deine Suche nach <b>${query}</b> ergab keine Treffer.</p>
                <p style="color: #4d5156; font-size: 14px;">Vorschläge:</p>
                <ul style="color: #4d5156; font-size: 14px;">
                    <li>Achte auf die richtige Schreibweise.</li>
                    <li>Probiere es mit allgemeineren Begriffen (z.B. "CPU", "iPhone" oder "Auto").</li>
                    <li>Suche nach Admin-Cheats (falls du sie kennst).</li>
                </ul>
            </div>`;
    }
}