// recupérer le dom
var result=document.getElementById('result');
var menu=document.getElementById('communes');
var input_cp=document.getElementById('cp');
function retr_cp(){
    //effacer le texte occurant
     result.textContent="";
     let code_postal=input_cp.value;
     console.log(code_postal);  
    // tester le code postal avec une regex
    const regex_cp=/^(0[1-9]|[1-8][0-9]|9[0-8])[0-9]{3}$/;
    if (regex_cp.test(code_postal)){
         try{
       // faire la requête api
       //convertir l'api en json
       // insérer les objets dans le sélecte
       // vide le menu
         
       
          
        fetch(`https://geo.api.gouv.fr/communes?codePostal=${code_postal}`)
        .then(response => response.json())
        .then(data => {
            // garder l'option par défaut si l'utilisateur entre un nouveau code postal sans raffraîchir
            menu.innerHTML="";
            let default_option=document.createElement('option')
            default_option.textContent="Sélectionnez une commune";
            default_option.value="";
            menu.appendChild(default_option)
            data.forEach( object_api => { // parcourt le tableau json composé de plusieurs object
                console.log(object_api) // affiche chaque objet
            let commune=document.createElement('option');
            commune.textContent=object_api.nom ;
            commune.value=object_api.code;
            commune.id="commune"
            menu.appendChild(commune);
        } )
      });
     }
     // gérer les erreurs
      catch(error){
        result.textContent="Erreur de l'api"  ;
       }
     }
    else{
       result.textContent="Veuillez sélectionner un code postal valide !"
       // vide le menu
       menu.innerHTML="";
       // garde l'option par défaut
       let default_option=document.createElement('option')
       default_option.textContent="Sélectionnez une commune";
       default_option.vaue="";
       menu.appendChild(default_option);
       return;
    }

}
async function disp_weather(insee){
    console.log(insee);
    result.textContent="";
    // récupérer le nom de la commune
    // requête api 
    // afficher dans le dom les éléments demandés
    //gestion des erreurs d'api
    const apiKey="0151d2f2b74239e64d3f426f5e6bea2dd11c92075c4fcda3ea410795701b1b79"
    try{
        var weather_api = await fetch(`https://api.meteo-concept.com/api/forecast/nextHours?token=${apiKey}&insee=${insee}`);
        var response= await weather_api.json();
        console.log(response);
     /*   La température minimale 
• La température maximale 
• La probabilité de pluie 
• Le nombre d’heures d’ensoleillement
Latitude décimale de la commune 
• Longitude décimale de la commune 
• Cumul de pluie sur la journée en mm 
• Vent moyen à 10 mètres en km/h 
• Direction du vent en degrés (0 à 360°) 

+ choisir via un curseur un nombre maximum pour les prévisions de 7j
*/ 
    }
    catch(error){
        result.textContent="Erreur de l'API";
        
    }
}

function reset(){
    // actualiser la page
     window.location.reload();
}

document.getElementById('cp').addEventListener('input',retr_cp);
// quand il ya un changement de sélection sur le menu on sélectionne l'option présentes
document.getElementById('retr_weather').addEventListener('click',async function() {
        // problème il rentre quand meme dans la fonction disp weather pcq insee n'est pas nul avec la valleur par défaut 
        let insee=document.getElementById('communes').value;
        const regex_cp=/^(0[1-9]|[1-8][0-9]|9[0-8])[0-9]{3}$/;
        let code_postal=input_cp.value;
        if (regex_cp.test(code_postal)){
         if(insee!=""){
            disp_weather(insee);
         }
         else{
            result.textContent="Veuillez sélectionner une commune !";
            return;
         }
        }
        else{
            result.textContent="Veuillez rentrer un code postal valide";
        }
        
 });
document.getElementById('reset').addEventListener('click',reset );
//tester si ya un code insee dans le select