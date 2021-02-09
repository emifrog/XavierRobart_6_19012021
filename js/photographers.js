// Methode Fetch //

fetch('./../JSON.json')
    .then((response) => response.json())
    .then(JsonData => {
          photographerProfil(JsonData)
          openLightBox(JsonData)          
          incrementLikesOnClick() 
    }).catch(error => console.error)

// Profil //

function photographerProfil(JsonData){
      const id = window.location.search.split('id=')[1];  
      const photographers = !id ? JsonData.photographers : JsonData.photographers.filter(photographer => photographer.id == id);

      photographers.forEach(element => {    // execute la fonction dans chaque element du tableau
            const domDiv = document.getElementById('photographe');
            const newDiv = document.createElement('div'); 
            const profilTemplate = `
              <div class="profil">
                <h2>${element.name}</h2>
                <p>${element.city}, ${element.country}</p>
                <p class="tagline">${element.tagline}</p>
                <p>${element.tags.map(tag => `<button class='tags'>#${tag}</button>`).join(" ")}</p>
                <button id="contact">Contactez-moi</button>
                <div class="photoProfil">
                    <img src="${element.portrait}" alt="photo">
                </div>
              </div>
            `
            newDiv.innerHTML = profilTemplate;
            domDiv.appendChild(newDiv);
            showModal(); 
            photographerWork(JsonData, element)
      }) 
}