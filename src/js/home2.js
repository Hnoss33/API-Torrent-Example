//aca se crearon 3 funciones la cual renderMoviesList invoca las otras funciones que a su vez 
//
//api the YTS---->
(async function load(){ 
    async function getData (url){ //aca getData nos esta devolviendo una promesa porque hace await 
     const response = await fetch(url);
     const data = await response.json();
     if (data.data.movie_count > 0) { // como la data movie list son arrays si no encuentra ningun numero que corresponde a una pelicula arroja el resultado 
         return data;
         //aca se acaba
     } //si no hay peliculas aca continua
     throw new Error('No se encontró ningun resultado'); //error cuando no se encuentra ninguna pelicula 
    }
    //Constantes globales de la funcion async
    // esta variable identifica el buscador el formulario de busqueda 
    //y abajo tenemos la funcion del evento 
     const $form = document.getElementById('form');
     const $home = document.getElementById('home');
     const $featuringContainer = document.getElementById('featuring');

    function setAttributes($element, attributes){
    for (const attribute in attributes) {
    $element.setAttribute(attribute, attributes[attribute]);
       }
    }  
    const BASE_API = 'https://yts.lt/api/v2/';

    function featuringTemplate(peli){
        return (
            `<div class="featuring">
            <div class="featuring-image">
              <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
            </div>
            <div class="featuring-content">
              <p class="featuring-title">Pelicula encontrada</p>
              <p class="featuring-album">${peli.title}</p>
            </div>
          </div>
          `
          )
         }
     $form.addEventListener('submit', async (event) => {
         //llamamos la funcion para evitar la carga 
     event.preventDefault();//con este codigo evitamos que se recarge la pagina cuando hacemos busquedas
     $home.classList.add('search-active')   
     const $loader = document.createElement('img');
     setAttributes($loader, {
        src: 'src/images/loader.gif',
        width: 50, 
        height: 50,
        })
        $featuringContainer.append($loader);

        const data = new FormData($form);

        try {
            const {     //asignacion de una variable por desestructuracion! 
                data: {
                movies: pelis
                }
            } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
            const HTMLString = featuringTemplate(pelis[0]); //este objeto lo obtuvimos haciendo un debbugin cuando se ejecuta el qery para saber la donde buscar 
            $featuringContainer.innerHTML = HTMLString;
        }   catch(error)    {
            alert(error.message);
            $loader.remove();
            $home.classList.remove('search-active');

        }
     })
     // -----------users loader-----------------------------------------------------------------------




  // -------------------------------------------------------------------------------------------------


     //Estas funciones se declaran primero
    function videoItemTemplate(movie, category) {
        return (
        `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category=${category}>
        <div class="primaryPlaylistItem-image">
        <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
        ${movie.title}
        </h4>
        </div>`
     )
    }

    function createTemplate(HTMLString){
        const html = document.implementation.createHTMLDocument();//esto construlle un nuevo documento HTML 
        html.body.innerHTML = HTMLString; // el innerHTML Reemplaza el contenido de <body> con una cadena vacía
        return html.body.children[0];
    }
    function addEventClick($element){
        $element.addEventListener('click', () => {
           showModal($element) //aca llamamos la funcion modal de abajo cuando hacemos click
        })
    }
    
    //The querySelector() method returns the first element that matches a specified CSS selector(s) in the document.
    //INICIO DE ITERACION!
    //esta funcion renderiza las imagenes a mostrar aca esta invocando el html que tiene el div que trae las peliculas y la categoria
    function renderMovieList(list, $container, category){ //esta funcion invoca las otras dos arriba
        //actionList.data.movies
        $container.children[0].remove(); //esto remueve la imagen de carga del container c uando pasa por aca
        list.forEach((movie) => {//esto es la iteracion de lista de peliculas IMPORTANTE!!
            const HTMLString = videoItemTemplate(movie, category);
            const movieElement = createTemplate(HTMLString);
            $container.append(movieElement);//The append()  the selected elements.
            //el metodo append() esta agregando HTMLString.
            const image = movieElement.querySelector('img');
            image.addEventListener('load', (event) => {
            event.srcElement.classList.add('fadeIn');
            })
            movieElement.classList.add('fadeIn'); //con esto le damos el efecto al movie element
            addEventClick(movieElement); //ACA ESTAMOS LLAMANDO la funcion para el evento click
        })
    }

    //Aca movimos las peticiones para que se ejecuten primero y despues se renderiza la lista (action, drama, animation)
    const {data: {movies: actionList} } = await getData (`${BASE_API}list_movies.json?genre=action`); //este codigo es con async await 
    const $actionContainer = document.querySelector('#action');
    renderMovieList(actionList, $actionContainer, 'action');

    const {data: {movies: dramaList} } = await getData (`${BASE_API}list_movies.json?genre=drama`); //este codigo es con async await 
    const $dramaContainer = document.getElementById('drama');
    renderMovieList(dramaList, $dramaContainer, 'drama');

    const {data: {movies: animationList} } = await getData (`${BASE_API}list_movies.json?genre=animation`); //este codigo es con async await 
    const $animationContainer = document.getElementById('animation');
    renderMovieList(animationList, $animationContainer, 'animation');
    
    
    const $modal = document.getElementById('modal');
    const $overlay = document.getElementById('overlay');
    const $hideModal = document.getElementById('hide-modal');//este el botom para cerrarlo 
    
    const $modalTitle = $modal.querySelector('h1');
    const $modalImage = $modal.querySelector('img');
    const $modalDescription = $modal.querySelector('p');

    function findById(list, id){ 
        return list.find((movie) => movie.id === parseInt (id, 10))
    }
    function findMovie(id, category){ //esta funcion find() es para mostrar la informacion especifica del modal al momento de hacer click o de accionar el evento click
        switch (category) { //switch nos recomienda colocar un caso por defecto, el switch evalua la categoria y las compara
            case 'action' : {
                return findById(actionList, id)
                }
            case 'drama' : {
            return findById(dramaList, id)
                }
            default : {
               return findById(animationList, id)
            }
        }
    }

    function showModal($element) { //con esta funcion le damos propiedades al modal cuando se muestre
        $overlay.classList.add('active'); //El método add() añade un nuevo elemento con un valor específico al final del objeto Set.
        $modal.style.animation = 'modalIn .8s forwards';//animacion que le designamos al modal cuando se muestre una animacion con css
        const id = $element.dataset.id;
        const category = $element.dataset.category;
        const data = findMovie(id, category);
        
        $modalTitle.textContent = data.title;
        $modalImage.setAttribute('src', data.medium_cover_image);
        $modalDescription.textContent = data.description_full;


    }
    $hideModal.addEventListener('click', hideModal); //con esta funcion ocultamos el modal
    function hideModal() {
        $overlay.classList.remove('active'); //metodo remove
        $modal.style.animation = 'modalOut .8s forwards';
    }

// ----------User random profiles-----------


})