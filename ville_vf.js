// recupérer le dom
var result=document.getElementById('result');
var menu=document.getElementById('communes');
var input_cp=document.getElementById('cp');
function retr_cp(){
    //effacer le texte occurant
     result.textContent="";
     let code_postal=input_cp.value
     console.log(code_postal);
    // tester le code postal avec une regex
    const regex_cp=/[0-9][1-8]([0-9]{3})/;
    if (regex_cp.test(code_postal)){
         try{
         // faire la requête api
        //convertir l'api en json
        // insérer les objets dans le sélecte
        fetch(`https://geo.api.gouv.fr/communes?codePostal=${code_postal}`)
        .then(response => response.json())
        .then(data => {
            menu.innerHTML="";
            data.forEach( object_api => { // parcourt le tableau json composé de plusieurs object
                console.log(object_api) // affiche chaque objet
            let commune=document.createElement('option');
            commune.textContent=object_api.nom ;
            commune.value=object_api.code;
            menu.appendChild(commune);
        }

        )
        
        });
    }
    // gérer les erreurs
    catch(error){
        result.textContent="Erreur de l'api"  ;
    }
   
    }
    else{
        result.textContent="Veuillez sélectionner un code postal valide !"
    }
   
}
function disp_weather(){
    result.textContent="";
    // récupérer le nom de la commune
    // requête api 
    // afficher dans le dom les éléments demandés
    //gestion des erreurs d'api
    try{
        fetch(fetch(`https://api.openweathermap.org/data/2.5/weather?q=${commune},FR&units=metric&lang=fr&appid=${apiKey}`))
    }
    catch(error){
        result.textContent="Erreur de l'API"
    }
}

function reset(){
    // actualiser la page
     window.location.reload();
}
document.getElementById('cp').addEventListener('input',retr_cp);
    
    
   
    

document.getElementById('retr_weather').addEventListener('click',async function() {
        
        let   insee=document.getElementById('commune').value;
        if(insee!=null){
            disp_weather(insee);
        }
        else{
            result.textcontent="Veuillez sélectionner une commune !";
        }
});
document.getElementById('reset').addEventListener('click',reset );
//tester si ya un code insee dans le select