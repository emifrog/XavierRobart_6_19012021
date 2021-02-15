// Methode Fetch //

fetch('./../JSON.json')
    .then((response) => response.json())
    .then(JsonData => {
          photographerProfil(JsonData)  //appel de la fonction
          openLightBox(JsonData)          
          incrementLikesOnClick() 
    }).catch(error => console.error)

// Photographe //

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
            showModal(element);
            let sum = photographerWork(JsonData.media)     // appel de la fonction 
            likesAndPrice(sum, photographerPrix);    //appel de la fonction
      }) 
}

// Profile //

function photographerWork(media){
      let sum = 0;
      homeElt = window.location.search.split('id=')[1];  
        media.forEach(element => {   
        if(homeElt == element.photographerId){
          const domDiv = document.getElementById('photographe-profile');
          const newDiv = document.createElement("div");
          sum += element.likes;
          const workTemplate = `         
            <div class="profile-photo"> 
                <div class="photo" data-id=${element.id}>
                    ${videoOrImage(element.image, element.video, element)}
                </div>   
                <div class="text">
                    <p> ${element.photoName}<b>${element.price} €  &nbsp <span class='profile-photo-info'>${element.likes}</span> <i class="fas fa-heart heartIcon"></i></b></p>
                </div>
            </div>
            `
          newDiv.innerHTML = workTemplate;
          domDiv.appendChild(newDiv);
          if ( 'image' in element) {currentPhotographerPhotos.push(element.image);}
          likesTable.push(element.likes);
        }})
        handleNextPrevButtons();
        return sum;  
}

// Like et Prix //

function likesAndPrice(sum, photographerPrix){
      const domDiv = document.getElementById('photographer-profile');
      const newDiv = document.createElement("div");
      const likesAndPrixTemplate = `
      <div id='likesBox' class="Likes">${sum}<i class="fas fa-heart"></i></div>
      <div class="Price">${photographerPrix}€ / jour</div>  
      `
        newDiv.classList.add('likesAndPriceContainer')
        newDiv.innerHTML = likesAndPrixTemplate;
        domDiv.appendChild(newDiv)
}