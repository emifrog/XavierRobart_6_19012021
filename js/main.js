// Methode Fetch //

function grabTheDataFromJSON(){
    fetch("./../JSON.json")  //permet de recuperer les ressources
      .then(response => response.json())
      .then(dataJson => { 
          displayPhotographers(dataJson); //appel de la fonction 
          displayByDefault(dataJson)       
      }).catch(error => console.error)
  };
  
  grabTheDataFromJSON();

// Affiche les photographes par defaut //

function displayByDefault(dataJson){
    console.log(dataJson)
    dataJson.photographers.forEach(photographe => {           //exécute une fonction donnée sur chaque élément du tableau
      const photographersDiv = document.getElementById('container');
      const div = document.createElement("div");  //methode pour creer un element html
      const photographerTemplate = `
      <div class="photographerContainer">
        <a href="photographers.html?id=${photographe.id}">
          <div class="portraitBox">
            <img src="${photographe.portrait}" alt="photo">
          </div>
          <h1 class="name">${photographe.name}</h1>
        </a>
        <p class="city">${photographe.city}, ${photographe.country}</p>
        <p class="tagline">${photographe.tagline}</p>
        <p class="price">${photographe.price}€/jour</p>
        <p class="tags">${photographe.tags.map(tag => `<span class="tag">#${tag}</span>`).join(" ")}</p>  
      </div>
      `  
      photographersDiv.appendChild(div);
      div.innerHTML = photographerTemplate;  //recupere la syntaxe HTML
    }); 
  };

// Fonction ACTIVE en clickant sur le bouton

function addActiveClass(){
  const buttons = document.querySelectorAll(".filters_container span");
  buttons.forEach(btn => btn.addEventListener("click", () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    btn.classList.add('active');
  }));
}
addActiveClass();

// Ajoute un événement à chaque click

function displayPhotographers(dataJson){
  const buttons = document.querySelectorAll(".filters_container span");
  buttons.forEach(btn => btn.addEventListener("click", () => {
    const photographersDiv = document.getElementById('container');
    photographersDiv.innerHTML = "";                      
    filterElements(dataJson, btn, photographersDiv); 
  }));
};

