
// Dictionnaire des codes météo

const weatherDescriptions = {
  0: "Ensoleillé",
  1: "Peu nuageux",
  2: "Ciel voilé",
  3: "Nuageux",
  4: "Très nuageux",
  5: "Couvert",
  6: "Brouillard",
  10: "Pluie faible",
  20: "Neige faible",
  60: "Orage faible",
};


// Récupération des éléments du DOM

var result = document.getElementById('result');
var menu = document.getElementById('communes');
var input_cp = document.getElementById('cp');
var weather = document.getElementById('weather');
var nodata=document.getElementById('no-data')
var response = {}; // Pour stocker la réponse météo
var weather_selection=document.getElementById('weather_selection')


// Slider : affichage de la valeur initiale

window.addEventListener('DOMContentLoaded', function () {
    const slider = document.getElementById('days');
    const display = document.getElementById('days_nb');
    display.textContent = slider.value;
    console.log("Slider chargé, valeur initiale :", slider.value);
});


// Récupération des communes selon le CP

function retr_cp() {
    result.textContent = "";
    let code_postal = input_cp.value;
    console.log("Code postal saisi :", code_postal);

    const regex_cp = /^(0[1-9]|[1-8][0-9]|9[0-8])[0-9]{3}$/;

    if (regex_cp.test(code_postal)) {
        try {
            fetch(`https://geo.api.gouv.fr/communes?codePostal=${code_postal}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Réponse API communes :", data);

                    if (!data.length) {
                        result.textContent = "Code postal valide mais non trouvé.";
                        menu.innerHTML = "";
                        menu.appendChild(defaultOption());
                        return;
                    }

                    menu.innerHTML = "";
                    menu.appendChild(defaultOption());

                    data.forEach(object_api => {
                        console.log("Commune trouvée :", object_api.nom);
                        let commune = document.createElement('option');
                        commune.textContent = object_api.nom;
                        commune.value = object_api.code;
                        commune.id = "commune";
                        menu.appendChild(commune);
                    });
                });
        } catch (error) {
            console.error("Erreur API communes :", error);
            result.textContent = "Erreur de l'API";
        }
    } else {
        result.textContent = "Veuillez sélectionner un code postal valide !";
        menu.innerHTML = "";
        menu.appendChild(defaultOption());
    }
}

// Option par défaut pour le menu déroulant

function defaultOption() {
    let opt = document.createElement('option');
    opt.textContent = "Sélectionnez une commune";
    opt.value = "";
    return opt;
}


// Affiche la météo selon le code INSEE

async function disp_weather(insee) {
    console.log("Code INSEE sélectionné :", insee);
    result.textContent = "";
    nodata.innerHTML=""

    const apiKey = "0151d2f2b74239e64d3f426f5e6bea2dd11c92075c4fcda3ea410795701b1b79";

    try {
        const weather_api = await fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${apiKey}&insee=${insee}`);
        const data = await weather_api.json();
        response = data;
        console.log("Réponse API météo :", data);
    } catch (error) {
        console.error("Erreur API météo :", error);
        result.textContent = "Erreur de l'API";
        return;
    }

    weather_selection.innerHTML = `
        <div id="options">
            <aria-label><input type="checkbox" id="showRain"> Afficher le cumul de pluie</aria-label>
            <aria-label><input type="checkbox" id="showWindir"> Afficher la direction du vent</aria-label>
            <aria-label><input type="checkbox" id="showCoords"> Afficher les coordonnées</aria-label>
            <aria-label><input type="checkbox" id="showWindspeed"> Afficher la vitesse du vent</aria-label>
        </div>
    `;
    disp_selected_days();
    document.getElementById('options').addEventListener('change', disp_selected_days);

    
}


// Affiche les prévisions météo

function disp_selected_days() {
    let days_nb = document.getElementById("days").value;
    console.log("Nombre de jours sélectionnés :", days_nb);

    let disp_weather = parseInt(days_nb);
    let oldCards = document.querySelectorAll(".WeatherCard_day");
    oldCards.forEach(card => card.remove());

    const showRain = document.getElementById('showRain')?.checked;  // vérifie si il ya une case cochée , le ?. permet de ne pas renvoyer d'erreur si la présence est nulle
    const showWindir = document.getElementById('showWindir')?.checked;
    const showCoords = document.getElementById('showCoords')?.checked;
    const showWindspeed = document.getElementById('showWindspeed')?.checked;

    for (let i = 0; i < disp_weather; i++) {
        let day = response.forecast[i];
        let code = day.weather;
        let description = weatherDescriptions[code] || 'inconnue';

        console.log(`Jour ${i + 1} - Code météo :`, code, "-", description);

        let disp = document.createElement("div");
        disp.className = `WeatherCard_day`;
        let html = `<strong>Jour ${i + 1} :</strong><br>${description}<br>`;
        html += `Température min : ${day.tmin}°, max : ${day.tmax}°<br>`;
        html += `Probabilité de pluie : ${day.probarain}%<br>`;
        html += `Ensoleillement : ${day.sun_hours} h<br>`;

        if (showRain) {
            html += `Cumul de pluie : ${day.rr10} mm<br>`;
        }
        if (showWindspeed) {
            html += `Vent moyen : ${day.wind10m} km/h<br>`;
        }
        if (showWindir) {
            html += `Direction du vent : ${day.dirwind10m}°<br>`;
        }
        if (showCoords && response.city) {
            html += `Coordonnées : ${response.city.latitude}, ${response.city.longitude}<br>`;
        }

        disp.innerHTML = html;
        weather.appendChild(disp);
    }
}


// Réinitialisation complète

function reset() {
    console.log("Réinitialisation en cours...");
    window.location.reload();
    const slider = document.getElementById('days');
    const display = document.getElementById('days_nb');
    slider.value = "1";
    display.textContent = "1"
}


// Événements utilisateurs

document.getElementById('cp').addEventListener('input', retr_cp);

document.getElementById('retr_weather').addEventListener('click', function () {
    let insee = document.getElementById('communes').value;
    const regex_cp = /^(0[1-9]|[1-8][0-9]|9[0-8])[0-9]{3}$/;
    let code_postal = input_cp.value;

    console.log("Bouton météo cliqué - INSEE :", insee, "- CP :", code_postal);

    if (regex_cp.test(code_postal)) {
        if (insee !== "") {
            disp_weather(insee);
        } else {
            result.textContent = "Veuillez sélectionner une commune !";
        }
    } else {
        result.textContent = "Veuillez rentrer un code postal valide";
    }
});
document.getElementById('days').addEventListener('input', disp_selected_days);
document.getElementById('reset').addEventListener('click', reset);








