// Methode Fetch //

function grabTheDataFromJSON(){
  fetch("./../JSON.json")    //permet de recuperer les ressources
    .then(response => response.json())
    .then(dataJson => { 
        displayPhotographers(dataJson);    //appel de la fonction
        displayByDefault(dataJson)                       
        filterPhotograpsIndividualTages(dataJson)       
        redirectAndFilter(dataJson)
    })
};

grabTheDataFromJSON();

// Affiche les photographes par defaut //

function displayByDefault(dataJson) {
  dataJson.photographers.map(photographe => {   //execute une fonction donnee sur chaque element du tableau
    const photographersDiv = document.getElementById('photographes_container');
    const div = document.createElement("div");   ////methode pour creer un element html
    const photographerTemplate = `
    <div class="photographerContainer">
      <a href="photographers.html?id=${photographe.id}">
        <div class="portrait">
          <img src="${photographe.portrait}" alt="photo">
        </div>
        <h1 class="name">${photographe.name}</h1>
      </a>
      <p class="city">${photographe.city}, ${photographe.country}</p>
      <p class="tagline">${photographe.tagline}</p>
      <p class="price">${photographe.price}€/jour</p>
      <p class="tags">${photographe.tags.map(tag => `<button id=${tag} class="tag individual-tags">#${tag}</button>`).join(" ")}</p>  
    </div>
    `  
    photographersDiv.appendChild(div);
    div.innerHTML = photographerTemplate;   //recupere la syntaxe html
  }); 
};

// Filtre //

const tagName = window.location.search.split('id=')[1];  
function redirectAndFilter(dataJson) {
  if(tagName){
    const photographersDiv = document.getElementById('photographes_container');
    photographersDiv.innerHTML = "";  
    filterElements(dataJson, tagName)
  }
}


// Fonction ACTIVE en clickant sur le bouton //

function addActiveClass() {
  const buttons = document.querySelectorAll(".filtres span");
  buttons.forEach(btn => btn.addEventListener("click", () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    btn.classList.add('active'); 
  }));
}
addActiveClass();

// Ajoute un événement à chaque clicke //

function displayPhotographers(dataJson){
  const buttons = document.querySelectorAll(".filtres span");
  buttons.forEach(btn => btn.addEventListener("click", () => {  //appel la fonction filtre
    const photographersDiv = document.getElementById('photographes_container');
    photographersDiv.innerHTML = "";    
    filterElements(dataJson, btn);       //appel de la fonction                               
  }));
};

// Filtre part tags //

function filterPhotograpsIndividualTages(dataJson) {  
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('individual-tags')) {
      const photographersDiv = document.getElementById('photographes_container');
      photographersDiv.innerHTML = "";                                      
      filterElements(dataJson, event.target);     // appel de la fonction
    }
  });
};
