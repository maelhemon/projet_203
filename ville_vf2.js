document.getElementById("cp").addEventListener("input", async function () {
    const codePostal = this.value.trim();
    const select = document.getElementById("commune");
    select.innerHTML = '<option value="">-- Sélectionnez une commune --</option>';

    if (codePostal.length === 5) {
        try {
            const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}`);
            const communes = await response.json();

            if (communes.length === 0) {
                select.innerHTML += '<option value="">Aucune commune trouvée</option>';
                return;
            }
            communes.forEach(commune => {
                const option = document.createElement("option");
                option.value = commune.nom;
                option.dataset.insee = commune.code; // pour récupérer le code INSEE plus tard
                option.textContent = commune.nom;
                select.appendChild(option);
            });

        } catch (error) {
            console.error("Erreur API communes :", error);
        }
    }
});

document.getElementById("btn-meteo").addEventListener("click", async function () {
    const select = document.getElementById("commune");
    const selectedOption = select.options[select.selectedIndex];
    const insee = selectedOption.dataset.insee;
    const commune = selectedOption.value;

    if (!insee) {
        alert("Veuillez sélectionner une commune.");
        return;
    }

    try {
        // Exemple avec OpenWeatherMap - nécessite une clé API gratuite
        const apiKey = "TA_CLE_API"; // Remplace par ta clé API perso
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${commune},FR&units=metric&lang=fr&appid=${apiKey}`);
        const meteo = await response.json();

        if (meteo.cod !== 200) {
            throw new Error(meteo.message);
        }

        document.getElementById("meteo-resultat").innerHTML = `
            <h3>Météo à ${commune}</h3>
            <p>🌡️ Température : ${meteo.main.temp} °C</p>
            <p>☁️ Conditions : ${meteo.weather[0].description}</p>
            <p>💨 Vent : ${meteo.wind.speed} km/h</p>
        `;
    } catch (error) {
        console.error("Erreur API météo :", error);
        document.getElementById("meteo-resultat").textContent = "Erreur lors de la récupération de la météo.";
    }
});
