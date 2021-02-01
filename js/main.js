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

// Affiche les photographes par defaut //

function displayByDefault(dataJson){
    console.log(dataJson)
    dataJson.photographers.forEach(photographe => { 
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