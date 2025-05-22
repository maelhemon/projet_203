// recupérer le dom
var result=document.getElementById('result');
var menu=document.getElementById('communes');
var input_cp=document.getElementById('cp');
function retr_cp(){
    //effacer le texte occurant
    result.textContent="";
    try{
         // faire la requête api
        //convertir l'api en json
        // insérer les objets dans le sélecte
        let code_postal=input_cp.value
        const response_api=fetch(`https://geo.api.gouv.fr/communes?codePostal=${code_postal}`).then(response => {response.json(); console.log(response)})
        response_api.forEach( object_api => {
            let commune=document.createElement('option');
            commune.textcontent=object_api.nom ;
            commune.value=object_api.code;
            menu.appendChild(commune);
        });
    }
    // gérer les erreurs
    catch(error){
        result.textContent="Erreur de l'api"  ;
    }
   
}
function disp_weather(){
    result.textContent="";
    //

}

function reset(){
    // actualiser la page
     window.location.reload();
}
document.getElementById('cp').addEventListener('input',async function() {
     // tester le code postal avec une regex
    let code_postal=input_cp.value;
    console.log(code_postal);
    const regex_cp=/[0-9][1-8]([0-9]{3})/;
    if (regex_cp.test(code_postal)){
        retr_cp();
    }
    else{
        result.textContent="Veuillez sélectionner un code postal valide !"
    }
    
});
document.getElementById('retr_weather').addEventListener('click',async function() {
        
        let   insee=document.getElementById('commune').value;
        if(!insee){
            disp_weather();
        }
        else{
            result.textcontent="Veuillez sélectionner une commune !";
        }
});
document.getElementById('reset').addEventListener('click',reset );
//tester si ya un code insee dans le select