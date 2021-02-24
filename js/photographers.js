// GLOBAL VARIABLES //
let currentPhotographerPhotos = [];
let currentLigthboxIndex = -1;
let likesTable = [];
let existingLikes = [];
let modifiedArray = [];
let JsonDATA;
let photoName = [];

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
                ${videoOrImage(element.image, element.video, element)}
            </div>   
            <div class="text">
                <p> ${element.photoName}<b>${element.price} €  &nbsp <span class='under-photo-info'>${element.likes}</span> <i class="fas fa-heart heartIcon"></i></b></p>
            </div>
        </div>
        `
      newDiv.innerHTML = workTemplate;
      domDiv.appendChild(newDiv);
      if ( 'image' in element) {currentPhotographerPhotos.push(element.image), photoName.push(element.photoName)}
      likesTable.push(element.likes);
    }})
    handleNextPrevButtons();
    return sum;  
}

//Verifie si les données sont des images ou des videos sur le modele

function videoOrImage(image, video, element) {
  if ('image' in element){
    return ` <img class="photos" aria-label="photo ${element.photoName}" src="${image}"> `
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

//increment likes on click
function incrementLikesOnClick() {
  const heartIcons = Array.from(document.getElementsByClassName('heartIcon')); // multiple heart icons
  heartIcons.forEach((likeIcon, index) => likeIcon.addEventListener('click', () => {
    
    // if the index of current photo is in the Arrey RETURN the index and stop executin IF NOT run the code block
    if (existingLikes.includes(index)) {return }
    else{
      const individualLikeBox = document.getElementsByClassName('under-photo-info');
      const totalLikesDivBox = document.getElementById("likesBox");
      likeIcon.classList.add('activeRed');
  
      let likesAfterAddition = likesTable[index] + 1;  // add 1 like to the individual current photo
      likesTable.splice(index, 1, likesAfterAddition); // replace the old value from the Array with the new value
  
      let globalNumberOfLikes = likesTable.reduce(function(a, b){return a + b;}); // return the sum of the array
  
      individualLikeBox[index].innerHTML = `<span>${likesAfterAddition}</span>`
      totalLikesDivBox.innerHTML = `<div>${globalNumberOfLikes}<i class="fas fa-heart"></i></div>`
    }
      // add the index of liked item to existingLikes Array everytime we click a photo
      existingLikes.push(index)
  }))
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

// Trier par ...
const trierParButtons = Array.from(document.getElementsByClassName('trierBtn'));
trierParButtons.forEach((btn, index) => btn.addEventListener('click', () => {
  
  if( index == 0) {
    //////////// sort by POPULARITY //////////////   
    modifiedArray = JsonDATA.media.sort((a, b) => {return b.likes - a.likes})
    document.getElementById("photographers").innerHTML = "";
    likesTable = [];
    currentPhotographerPhotos = [];
    photographerWork(modifiedArray);
    openLightBox(JsonDATA)
    incrementLikesOnClick()
            
  }else if (index == 1) {
    /////////// sort by DATE /////////////////////    
    modifiedArray = JsonDATA.media.sort((a, b) => { return new Date(a.date).valueOf() - new Date(b.date).valueOf();}) 
    document.querySelector("#photographers").innerHTML = "";;
    likesTable = [];
    currentPhotographerPhotos = [];
    photographerWork(modifiedArray);
    openLightBox(JsonDATA)
    incrementLikesOnClick()

  }else if ( index == 2) {
    ////////////// sort by ALFABETIC ORDER ///////
    modifiedArray = JsonDATA.media.sort((a, b) => {
    if(a.photoName.toLowerCase() < b.photoName.toLowerCase()) { return -1;}
    else if (a.photoName.toLowerCase() > b.photoName.toLowerCase()) {return 1;}
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
      const photoNaneDom = document.getElementById('photoName');
      const src = currentPhotographerPhotos[index];
      const nameSrc = photoName[index];  
      lightboxcontainer.style.display = 'block';
      currentLigthboxIndex = index;   
      photographersphotos.innerHTML = `<img src="${src}" />`;
      photoNaneDom.innerHTML = `${nameSrc}`  
    }))
}

// Defilement des photos //

function handleNextPrevButtons() {
  const previousBtn = document.querySelector('.leftIcon');
  const nextBtn = document.querySelector('.rightIcon');
  const photographersphotos = document.getElementById('photographers-photos');
  const photoNaneDom = document.getElementById('photoName');

  previousBtn.addEventListener('click', () => {
    currentLigthboxIndex -= 1;
    if (currentLigthboxIndex < 0) {
      currentLigthboxIndex = currentPhotographerPhotos.length - 1;
    }
    const src = currentPhotographerPhotos[currentLigthboxIndex];
    photographersphotos.innerHTML = `<img src="${src}" />`; 

    if (currentLigthboxIndex < 0){
      currentLigthboxIndex = photoName.length - 1;
    }
    const nameSrc = photoName[currentLigthboxIndex]; 
    photoNaneDom.innerHTML = `${nameSrc}` 
  });

  nextBtn.addEventListener('click', () => {
    currentLigthboxIndex += 1;
    if (currentLigthboxIndex > currentPhotographerPhotos.length - 1) {
      currentLigthboxIndex = 0;
    }
    const src = currentPhotographerPhotos[currentLigthboxIndex];
    photographersphotos.innerHTML = `<img src="${src}" />`;

    if (currentLigthboxIndex > photoName.length - 1){
      currentLigthboxIndex = 0;    
   }
   const nameSrc = photoName[currentLigthboxIndex]; 
   photoNaneDom.innerHTML = `${nameSrc}`
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

////// lightBox using keyboard
document.addEventListener('keydown', (key) => {

  //ENTER KEY
  if(key.code == "Enter") {

  }

  //Esc KEY
  else if(key.code == "Escape"){
    const lightBoxcontainer = document.getElementById('lightBoxContainer');
    lightBoxcontainer.style.display = 'none';
  }

  //ArrowRight KEY
  else if(key.code == "ArrowRight"){
    const photoNaneDom = document.getElementById('photoName');

    currentLigthboxIndex += 1;
    if (currentLigthboxIndex > currentPhotographerPhotos.length - 1) {
      currentLigthboxIndex = 0;
    }
    const src = currentPhotographerPhotos[currentLigthboxIndex];
    photoPlaceHolder.innerHTML = `<img src="${src}" />`;
    
    if (currentLigthboxIndex > photoName.length - 1){
      currentLigthboxIndex = 0;    
   }
   const nameSrc = photoName[currentLigthboxIndex]; 
   photoNaneDom.innerHTML = `${nameSrc}`
  }

  //ArrowLeft KEY
  else if(key.code == "ArrowLeft"){
    const photoNaneDom = document.getElementById('photoName');

    currentLigthboxIndex -= 1;
    if (currentLigthboxIndex < 0) {
      currentLigthboxIndex = currentPhotographerPhotos.length - 1;
    }
    const src = currentPhotographerPhotos[currentLigthboxIndex];
    photoPlaceHolder.innerHTML = `<img src="${src}" />`; 

    if (currentLigthboxIndex < 0){
      currentLigthboxIndex = photoName.length - 1;
    }
    const nameSrc = photoName[currentLigthboxIndex]; 
    photoNaneDom.innerHTML = `${nameSrc}` 
  }
});


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

  document.getElementById("form").addEventListener('click', () => {
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
