// Methode Fetch //

function grabTheDataFromJSON(){
    fetch("./../JSON.json")  //permet de recuperer les ressources
      .then(response => response.json())
      .then(dataJson => { 
          displayPhotographers(dataJson); //appel de la fonction 
          displayByDefault(dataJson)      //appel de la fonction 
      }).catch(error => console.error)
  };
  
  grabTheDataFromJSON();

  