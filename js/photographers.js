// Methode Fetch //

fetch('./../JSON.json')
    .then((response) => response.json())
    .then(JsonData => {
          photographerProfil(JsonData)
          openLightBox(JsonData)          
          incrementLikesOnClick() 
    }).catch(error => console.error)

