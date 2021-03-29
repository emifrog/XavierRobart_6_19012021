// GLOBAL VARIABLES //
let currentPhotographerPhotos = [];
let currentLigthboxIndex = -1;
let likesTable = [];
let existingLikes = [];
let modifiedArray = [];
let JsonDATA;
let nomPhoto = [];

// Methode Fetch //

fetch('./../JSON.json')
.then((response) => response.json())
.then(JsonData => {
      photographerProfil(JsonData)  // appel de la fonction
      openLightBox(JsonData)       
      incrementLikesOnClick()     
      JsonDATA = JsonData;
})

// Photographers Profil //

function photographerProfil(JsonData){
  const id = window.location.search.split('id=')[1];  
  const photographers = !id ? JsonData.photographers : JsonData.photographers.filter(photographer => photographer.id == id);
  photographers.forEach(element => {
    const domDiv = document.getElementById('photographer-container');
    const newDiv = document.createElement('div');
    const photographerPrice = element.price;
    const profilTemplate = `
      <section aria-label="Photographer Profil" class="profil-container">
        <h2>${element.name}</h2>
        <p>${element.city}, ${element.country}</p>
        <p class="tagline">${element.tagline}</p>
        <p >${element.tags.map(tag => `<a  id="cursorAjout" href="index.html?id=${tag}" class='tags'>#${tag}</a>`).join(" ")}</p>
        <button id="form">Contactez-moi</button>
        <div class="photoBox">
            <img src="${element.portrait}" alt="photo de ${element.name}">
        </div>
      </section>
    `
    newDiv.innerHTML = profilTemplate;
    domDiv.appendChild(newDiv);
    showModal(element);                            
    let sum = photographerWork(JsonData.media)     
    likesAndPrice(sum, photographerPrice);        
    
  }) 
}

// Photographers Template //

function photographerWork(media){
  let sum = 0;
  homeElt = window.location.search.split('id=')[1];  
    media.forEach(element => {   
    if(homeElt == element.photographerId){
      const domDiv = document.getElementById('photographers');
      const newDiv = document.createElement("div");
      sum += element.likes;
      const workTemplate = `         
        <div class="photo-box"> 
            <div class="photo" data-id=${element.id}>
                ${videoOrimage(element.image, element.video, element)}
            </div>   
            <div class="text">
                <p> ${element.photo}<b>${element.price} €  &nbsp <span class='photo-info'>${element.likes}</span> <i class="fas fa-heart heartIcon"></i></b></p>
            </div>
        </div>
        `
      newDiv.innerHTML = workTemplate;
      domDiv.appendChild(newDiv);
      if ( 'image' in element) {currentPhotographerPhotos.push(element.image), nomPhoto.push(element.photo)}
      likesTable.push(element.likes);
    }})
    handleNextPrevButtons();
    return sum;  
}

//Verifie si les données sont des images ou des videos sur le modele

function videoOrimage(image, video, element) {
  if ('image' in element){
    return ` <img class="photos" aria-label="photo ${element.nomPhoto}" src="${image}"> `
  }
  else if ('video' in element){
    return ` <iframe src="${video}" width="285px" height="255px" controls=0></iframe>`
  }
}

// Likes & Price //

//total likes and price Box
function likesAndPrice(sum, photographerPrice){
  const domDiv = document.getElementById('likes-price-container');
  const newDiv = document.createElement("div");
  const likesAndPriceTemplate = `
  <div id='likesBox' class="Likes">${sum}<i class="fas fa-heart"></i></div>
  <div class="Price">${photographerPrice}€ / jour</div>  
  `
    newDiv.classList.add('likesAndPriceContainer')
    newDiv.innerHTML = likesAndPriceTemplate;
    domDiv.appendChild(newDiv)
}

//L likes
function incrementLikesOnClick() {
  const heartIcons = Array.from(document.getElementsByClassName('heartIcon')); 
  heartIcons.forEach((likeIcon, index) => likeIcon.addEventListener('click', () => {
    
  
    if (existingLikes.includes(index)) {return }
    else{
      const individualLikeBox = document.getElementsByClassName('photo-info');
      const totalLikesDivBox = document.getElementById("likesBox");
      likeIcon.classList.add('activeRed');
  
      let likesAfterAddition = likesTable[index] + 1; 
      likesTable.splice(index, 1, likesAfterAddition); 
  
      let globalNumberOfLikes = likesTable.reduce(function(a, b){return a + b;}); 
  
      individualLikeBox[index].innerHTML = `<span>${likesAfterAddition}</span>`
      totalLikesDivBox.innerHTML = `<div>${globalNumberOfLikes}<i class="fas fa-heart"></i></div>`
    }
      existingLikes.push(index)
  }))
}

// TRIER PAR //

// OPEN //

document.getElementById('dropdown-btn').addEventListener('click', () => {
  const hidenPart = document.getElementById("dropdown-trier");
  const chevronUpIcon = document.getElementById("close-up-icon");
  const chevronDownIcon = document.getElementById('dropdown-btn');  
      hidenPart.classList.add("show");  
      chevronUpIcon.classList.remove("fa-chevron-up-NO");
      chevronDownIcon.classList.toggle("fa-chevron-up-NO");
})

// CLOSE //

document.getElementById("close-up-icon").addEventListener('click', () => {
  const hidenPart = document.getElementById("dropdown-trier");
  const chevronUpIcon = document.getElementById("close-up-icon");
  const chevronDownIcon = document.getElementById('dropdown-btn');
      hidenPart.classList.remove("show");
      chevronUpIcon.classList.add("fa-chevron-up-NO");
      chevronDownIcon.classList.toggle("fa-chevron-up-NO");
})

// Trier par ... //

const trierParButtons = Array.from(document.getElementsByClassName('trierBtn'));
trierParButtons.forEach((btn, index) => btn.addEventListener('click', () => {
  
  if( index == 0) {
    // Popularite //  
    modifiedArray = JsonDATA.media.sort((a, b) => {return b.likes - a.likes})
    document.getElementById("photographers").innerHTML = "";
    likesTable = [];
    currentPhotographerPhotos = [];
    photographerWork(modifiedArray);
    openLightBox(JsonDATA)
    incrementLikesOnClick()
            
  }
  else if (index == 1) {
    // Date //    
    modifiedArray = JsonDATA.media.sort((a, b) => { return new Date(a.date).valueOf() - new Date(b.date).valueOf();}) 
    document.querySelector("#photographers").innerHTML = "";;
    likesTable = [];
    currentPhotographerPhotos = [];
    photographerWork(modifiedArray);
    openLightBox(JsonDATA)
    incrementLikesOnClick()

  }
  else if ( index == 2) {
    // Titre //
    modifiedArray = JsonDATA.media.sort((a, b) => {
    if(a.nomPhoto.toLowerCase() < b.nomPhoto.toLowerCase()) { return -1;}
    else if (a.nomPhoto.toLowerCase() > b.nomPhoto.toLowerCase()) {return 1;}
    })
        document.querySelector("#photographers").innerHTML = "";;
        likesTable = [];
        currentPhotographerPhotos = [];
        photographerWork(modifiedArray);
        openLightBox(JsonDATA)
        incrementLikesOnClick()

  }
}));

// LIGHTBOX //

// Open //

function openLightBox() {
  const getPhotos = Array.from(document.getElementsByClassName('photo'));
    getPhotos.forEach((photo, index) => photo.addEventListener("click", () => {

      const photographersphotos = document.getElementById('photographers-photos');
      const lightboxcontainer = document.getElementById('lightbox-container');
      const nomPhotoDom = document.getElementById('photo');
      const src = currentPhotographerPhotos[index];
      const nameSrc = nomPhoto[index];
      
      lightboxcontainer.style.display = 'block';
      currentLigthboxIndex = index;   
      photographersphotos.innerHTML = `<img src="${src}" />`;
      nomPhotoDom.innerHTML = `${nameSrc}`  
    }))
}

// Defilement des photos //

function handleNextPrevButtons() {
  const previousBtn = document.querySelector('.leftIcon');
  const nextBtn = document.querySelector('.rightIcon');

  previousBtn.addEventListener('click', () => {
    currentLigthboxIndex -= 1;
    moveImages(); 
  });

  nextBtn.addEventListener('click', () => {
    currentLigthboxIndex += 1;
    moveImages();
  })
}

// Defilement des photos au clavier //
document.addEventListener('keydown', (key) => {

  // Button Esc //
  if(key.code == "Escape"){
    const lightboxcontainer = document.getElementById('lightbox-container');
    lightboxcontainer.style.display = 'none';
  }

  // Fleche Droite //
  else if(key.code == "ArrowRight"){
    currentLigthboxIndex += 1;
    moveImages();
  }

  // Fleche Gauche //
  else if(key.code == "ArrowLeft"){
    currentLigthboxIndex -= 1;
    moveImages();
  }
  
});

function moveImages(){
  const photographersphotos = document.getElementById('photographers-photos');
  const nomPhotoDom = document.getElementById('photo');

  if (currentLigthboxIndex < 0) {
    currentLigthboxIndex = currentPhotographerPhotos.length - 1;
  }
  else if (currentLigthboxIndex > currentPhotographerPhotos.length - 1) {
    currentLigthboxIndex = 0;
  }

  const src = currentPhotographerPhotos[currentLigthboxIndex];
  photographersphotos.innerHTML = `<img src="${src}" />`; 

  if (currentLigthboxIndex < 0){
    currentLigthboxIndex = nomPhoto.length - 1;
  }
  else if (currentLigthboxIndex > nomPhoto.length - 1){
    currentLigthboxIndex = 0;    
  }

  const nameSrc = nomPhoto[currentLigthboxIndex]; 
  nomPhotoDom.innerHTML = `${nameSrc}` 
}

// Close //

function closeLightBox(){
  const closeLightBoxBtn = document.querySelector('.closeIcon');
    closeLightBoxBtn.addEventListener('click', () => {
      const lightboxcontainer = document.getElementById('lightbox-container');
      lightboxcontainer.style.display = 'none';
    })
}
closeLightBox()

// Formulaire //

const form = document.querySelector('.form-container form');
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const prenom = document.getElementById('prenom');
    const nom = document.getElementById('nom');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const errorPrenom = document.getElementById('error-prenom');
    const errorNom = document.getElementById('error-nom');
    const errorMail = document.getElementById('error-email');
    const errorMessage = document.getElementById('error-message');
    const prenomOK = validateString(prenom ,prenom.value, 2, errorPrenom, "Veuillez entre 2 ou plus de caracteres");
    const nomOk = validateString(nom ,nom.value, 2, errorNom, "Veuillez entre 2 ou plus de caracteres");
    const messageOk = validateString(message, message.value, 10, errorMessage, "Veuillez entre 10 ou plus de caracteres");
    const emailOk = checkEmail(email, email.value, errorMail, "Veuillez entre une adresse mail valide");

    if( prenomOK && nomOk && messageOk && emailOk){
        const formModal = document.getElementById('form-container');
        formModal.style.display = "none";
        alert('Message envoyer!')
        form.reset();
    }
})

// Ouverture formulaire //

function showModal(element){

  document.getElementById("form").addEventListener('click', () => {
    const formModal = document.getElementById('form-container');
    formModal.style.display = "block";
    const nameOfThePhotographe = document.getElementById('name-photographe');
    const nameTemplate = `${element.name}`
    nameOfThePhotographe.innerHTML = nameTemplate;
  })
}

// Fermeture du formulaire avec X //

document.getElementById('close-button').addEventListener('click', () => {
    const formModal = document.getElementById('form-container');
    formModal.style.display = "none";
})

// Validite des inputes //

function validateString(border ,entry, size, errorElt, errorMessage) {
  if ( entry.length < size ) {
    errorElt.innerHTML = errorMessage;
    errorElt.style.color = "white";
    errorElt.style.fontSize = "0.8rem";
    border.style.border = "1px solid red";
    return false;
  }else {
    errorElt.innerHTML = " ";
    border.style.border = "1px solid white";
    return true;
  }
}

// Validation de l'email //

function checkEmail(border, emajll, errorElt, errorMessage ) {
    let patern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emajll.toLowerCase().match(patern) || emajll == '') {
        errorElt.innerHTML = errorMessage;
        errorElt.style.color = "white";
        errorElt.style.fontSize = "0.8rem";
        border.style.border = "1px solid red";
        return false;
    }else {
        errorElt.innerHTML = "";
        border.style.border = "1px solid white";
        return true;
    }
}
