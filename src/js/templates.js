
//api the YTS---->
(async function load(){ //el async esta envuelto en parentecis ya que se auto llama con el load, 
//esta palabra reservada hace que espere la peticion de la API (await)
//=await espera la peticion del api
async function getData (url){ //aca getData nos esta devolviendo una promesa porque hace await 
 const response = await fetch(url);
 const data = await response.json()
 return data;
}
 const actionList = await getData ('https://yts.lt/api/v2/list_movies.json?genre=action'); //este codigo es con async await 
 const dramaList = await getData ('https://yts.lt/api/v2/list_movies.json?genre=drama'); //este codigo es con async await 
 const animationList = await getData ('https://yts.lt/api/v2/list_movies.json?genre=animation'); //este codigo es con async await 
console.log(actionList, dramaList, animationList)
debugger
actionList.movies.forEach((item) => {

})

const $actionContainer = document.querySelector('#action');
const $dramaContainer = document.getElementById('#drama');
const $animationContainer = document.getElementById('#animation');

const $featuringContainer = document.getElementById('#featuring');
const $form = document.getElementById('#form');
const $home = document.getElementById('#home');

const $modal = document.getElementById('modal');
const $overlay = document.getElementById('overlay');
const $hideModal = document.getElementById('hide-modal');

const $modalTitle = $modal.querySelector('h1');
const $modalImage = $modal.querySelector('img');
const $modalDescription = $modal.querySelector('p');

function videoItemTemplate(src, title) {
    return (
      `<div class="primaryPlaylistItem">
    <div class="primaryPlaylistItem-image">
    <img src="${src}">
    </div>
    <h4 class="primaryPlaylistItem-title">
    Titulo de la peli
    </h4>
    </div>`
    )}

// console.log(videoItemTemplate());
})()
 