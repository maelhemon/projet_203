document.getElementById("cp").addEventListener("input",async function() {
    let code_postal = document.getElementById("cp").value;//récupère le code postal que l'utilisateur rentre
    console.log(code_postal)
    let select=document.getElementById("commune")
    select.innerHTML='<option value="">-- Sélectionnez une commune --</option>'; //vide le menu déroulant à chaque reload de la page
    fetch('https://geo.api.gouv.fr/communes?codePostal=' + code_postal) //requete get vers l'api
        .then((response) => response.json()) // conversion du resultat de la requete en json
        .then((json) => {  // le resultat se transforme en variable json
            console.log("Réponse API :", json); // affiche dans la console la réponse de l'api
           let data=json.map(commune=>`<option value="${commune.nom}">${commune.nom}</option>`).join(" ") // déclare une variable data qui va mapper chaque nom des communes présentes dans le json de l'api  via le .join
           select.innerHTML+=data // l'afficher dans le menu déroulant
           let insee=json.map(insee=>insee.code) // récupérer dans un tableau via une fonction flêchée et la méthode .map et .code qui permet de récupérer les valeurs du champs code insee de la réponse de l' API
            console.log(insee)
            return insee
        })
        .catch((error) => {
            console.error("Erreur API :", error); // affiche dans la console le fail de l'interrogation de l'api
        });
});
//var listener_disp=document.getElementById("retr_meteo").addEventListener(InputEvent);
//if (insee!=0 && listener_disp){
//    let data = retr_post
//    function retr_meteo(data){
//
//    }
//}

// ajouter des eventlistener pour quand l'utilisateur rentre un cp la première api affiche les communes
// ensuite lorsque l'utilisateur clique sur le bouton afficher => la météo s'affiche
// faire une fonction qui permet d'effacer la recherche si erreur api ouvsi boutton effacer appuyer => window.location.reload();
// faire en sorte que ce soit bien un code postal valide qui est rentré