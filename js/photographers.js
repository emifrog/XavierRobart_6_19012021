
// GLOBAL VARIABLES //
let currentPhotographerPhotos = [];
let currentLigthboxIndex = -1;
let likesTable = [];
let existingLikes = [];
let modifiedArray = [];
let JsonDATA;

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
    const profilTemplate = `
      <div class="profil-container">
        <h2>${element.name}</h2>
        <p>${element.city}, ${element.country}</p>
        <p class="tagline">${element.tagline}</p>
        <p >${element.tags.map(tag => `<a  id="cursorAjout" href="index.html?id=${tag}" class='tags'>#${tag}</a>`).join(" ")}</p>
        <button id="test">Contactez-moi</button>
        <div class="photoBox">
            <img src="${element.portrait}" alt="photo">
        </div>
      </div>
    `
    newDiv.innerHTML = profilTemplate;
    domDiv.appendChild(newDiv);
    showModal(element);                            
    let sum = photographerWork(JsonData.media)     
    photographerWork(sum);        
    
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
                ${videoOrImage(element.image, element.video, element)}
            </div>   
            <div class="text">
                <p> ${element.photoName}<b>${element.price} €  &nbsp <span class='under-photo-info'>${element.likes}</span> <i class="fas fa-heart heartIcon"></i></b></p>
            </div>
        </div>
        `
      newDiv.innerHTML = workTemplate;
      domDiv.appendChild(newDiv);
      if ( 'image' in element) {currentPhotographerPhotos.push(element.image);}
    }})
    handleNextPrevButtons();
    return sum;  
}

//Verifie si les données sont des images ou des videos sur le modele

function videoOrImage(image, video, element) {
  if ('image' in element){
    return ` <img src="${image}">`
  }
  else if ('video' in element){
    return ` <iframe src="${video}" width="285px" height="255px" controls=0></iframe>`
  }
}


// TRIER PAR Filter //

// OPEN

document.getElementById('dropdown-btn').addEventListener('click', () => {
  const hidenPart = document.getElementById("dropdown-trier");
  const chevronUpIcon = document.getElementById("close-up-icon");
  const chevronDownIcon = document.getElementById('dropdown-btn');  
      hidenPart.classList.add("show");  
      chevronUpIcon.classList.remove("fa-chevron-up-NO");
      chevronDownIcon.classList.toggle("fa-chevron-up-NO");
})

// CLOSE

document.getElementById("close-up-icon").addEventListener('click', () => {
  const hidenPart = document.getElementById("dropdown-trier");
  const chevronUpIcon = document.getElementById("close-up-icon");
  const chevronDownIcon = document.getElementById('dropdown-btn');
      hidenPart.classList.remove("show");
      chevronUpIcon.classList.add("fa-chevron-up-NO");
      chevronDownIcon.classList.toggle("fa-chevron-up-NO");
})


// LIGHTBOX //

// Open //

function openLightBox() {
  const getPhotos = Array.from(document.getElementsByClassName('photo'));
    getPhotos.forEach((photo, index) => photo.addEventListener("click", () => {
      currentLigthboxIndex = index;
      const photographersphotos = document.getElementById('photographers-photos');
      const lightboxcontainer = document.getElementById('lightbox-container');
      lightboxcontainer.style.display = 'block';
      const src = currentPhotographerPhotos[index];      
      photographersphotos.innerHTML = `<img src="${src}" />`;     
    }))
}

// Defilement des photos //

function handleNextPrevButtons() {
  const previousBtn = document.querySelector('.leftIcon');
  const nextBtn = document.querySelector('.rightIcon');
  const photographersphotos = document.getElementById('photographers-photos');

  previousBtn.addEventListener('click', () => {
    currentLigthboxIndex -= 1;
    if (currentLigthboxIndex < 0) {
      currentLigthboxIndex = currentPhotographerPhotos.length - 1;
    }
    const src = currentPhotographerPhotos[currentLigthboxIndex];
    photographersphotos.innerHTML = `<img src="${src}" />`; 
  });

  nextBtn.addEventListener('click', () => {
    currentLigthboxIndex += 1;
    if (currentLigthboxIndex > currentPhotographerPhotos.length - 1) {
      currentLigthboxIndex = 0;
    }
    const src = currentPhotographerPhotos[currentLigthboxIndex];
    photographersphotos.innerHTML = `<img src="${src}" />`; 
  })
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
    const emailOk = checkEmail(email, email.value, errorMail, "Veuillez entre une adresse mail valid");

    if( prenomOK && nomOk && messageOk && emailOk){
        const formModal = document.getElementById('form-container');
        formModal.style.display = "none";
        alert('Message envoyer!')
        form.reset();
    }
})

// Ouverture formulaire //

function showModal(element){

  document.getElementById("test").addEventListener('click', () => {
    const formModal = document.getElementById('form-container');
    formModal.style.display = "block";
    const nameOfThePhotographe = document.getElementById('nameOfThePhotopgraphe');
    const nameTemplate = `${element.name}`
    nameOfThePhotographe.innerHTML = nameTemplate;
  })
}

// Fermeture du formulaire avec X //

document.getElementById('X-button').addEventListener('click', () => {
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
