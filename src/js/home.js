// GETTING DATA FROM LOCAL STORAGE

(async function load() {

    async function getData(url) {
      const response = await fetch(url);
      const data = await response.json();
      if (data.data.movie_count > 0) { 
        return data;
      }
      throw new Error('No se encontró ningun resultado');
    }
    const $form = document.getElementById('form');
    const $home = document.getElementById('home');
    const $featuringContainer = document.getElementById('featuring');
  
    function setAttributes($element, attributes) {
      for (const attribute in attributes) {
        $element.setAttribute(attribute, attributes[attribute]);
      }
    }
    const BASE_API = 'https://yts.mx/api/v2/';

  //esta funcion es para el buscador de resultados traidos desde la API
    function featuringTemplate(peli) {
      return (
        `
        <div class="featuring">
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
      event.preventDefault();
      $home.classList.add('search-active')
      const $loader = document.createElement('img');
      setAttributes($loader, {
        src: 'src/images/loader.gif',
        height: 50,
        width: 50,
      })
      $featuringContainer.append($loader);
  
      const data = new FormData($form);
      try {
        const {
          data: {
            movies: pelis
          }
        } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
  
        const HTMLString = featuringTemplate(pelis[0]);
        $featuringContainer.innerHTML = HTMLString;
      } catch(error) {
        alert(error.message);
        $loader.remove();
        $home.classList.remove('search-active');
      }
    })
  
    // -----------comedy loader-----------------------------------------------------------------------
  
    const $img2 = document.createElement('img');
    setAttributes($img2, {
      src: 'src/images/loader.gif',
      height: 50,
      width: 50,
    })
    const $comedyContainer = document.getElementById('comedyList')
    $comedyContainer.append($img2)
  
    // -----------users loader-----------------------------------------------------------------------
  
    const $img3 = document.createElement('img');
    setAttributes($img3, {
      src: 'src/images/loader.gif',
      height: 50,
      width: 50,
    })
    const $usersContainer = document.getElementById('usersList');
    $usersContainer.append($img3)
  
    // -------------------------------------------------------------------------------------------------
  
    function videoItemTemplate(movie, category) { //esto es para las secciones DRAMA, ACCION, ANIMACION, se retorna el template del html para crear la lista
        //le pasamos la propiedad category y movie que trae la informacion de la api y la coloca en el div
        //el signo pesos $ es una variable dinamica, para traer los datos dinamicos
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
    function createTemplate(HTMLString) {
      const html = document.implementation.createHTMLDocument();//esto construlle un nuevo documento HTML 
      html.body.innerHTML = HTMLString;// el innerHTML Reemplaza el contenido de <body> con una cadena vacía
      return html.body.children[0];
    }
    function addEventClick($element) {
      $element.addEventListener('click', () => {
        showModal($element)
      })
    }
    //INICIO DE ITERACION!
    //esta funcion renderiza las imagenes a mostrar aca esta invocando el html que tiene el div que trae las peliculas y la categoria
    function renderMovieList(list, $container, category) {
      $container.children[0].remove(); //esto remueve la imagen de carga del container c uando pasa por aca
      list.forEach((movie) => { //El método forEach() ejecuta la función indicada una vez por cada elemento del array.
        const HTMLString = videoItemTemplate(movie, category); //esta constante es igiual a la funcion que coloca el template que a su vez tiene movies y category
        const movieElement = createTemplate(HTMLString); // esta variable crea el template , arriba esta la funcion de esta 
        $container.append(movieElement);//agrega el el template al movieElement que a su ves llama al template que se creo en la funcion
        const image = movieElement.querySelector('img');//esto selecciona las imagenes del API en la linea de abajo 
        // cuando el addeventlistener se activa crea un evento con esta arrow function que agrega el fadein al evento
        image.addEventListener('load', (event) => {
          event.srcElement.classList.add('fadeIn');
        })
        addEventClick(movieElement);
      })
    }
  
    async function cacheExist (category) { // como vamos a pedir datos y a esperar debemos crear el async
      const listName = `${category}List`//todas terminan en list asi que colocamos o interpolamos category con ${...} syntax:
      const cacheList = localStorage.getItem(listName)//La propiedad de sólo lectura localStorage te permite acceder al objeto local Storage; los datos persisten almacenados entre de las diferentes sesiones de navegación.
      if(cacheList) { // si este cache list es true entonces retorna el paquete JSON
        return JSON.parse(cacheList)//método JSON.parse() analiza una cadena de texto como JSON, transformando opcionalmente  el valor producido por el análisis. y la retorna
      }
      //en la linea de abajo: 140 entramos a data, entramos a movies y le colocamos el nombre data
      const { data: { movies: data } } = await getData(`${BASE_API}list_movies.json?genre=${category}`)
      localStorage.setItem(listName, JSON.stringify(data))//propiedad para acceder al objeto local listName que es la constante y el JSON.stringify que trae la constante data 
      return data;
    }
  
    const actionList = await cacheExist('action') //esta variable pregunta y espera, buscando la lista de accion que se llama en el cache exist
    const $actionContainer = document.querySelector('#action');
    renderMovieList(actionList, $actionContainer, 'action');

  
    const dramaList = await cacheExist('drama')
    const $dramaContainer = document.getElementById('drama');
    renderMovieList(dramaList, $dramaContainer, 'drama');
  
    const animationList = await cacheExist('animation')
    const $animationContainer = document.getElementById('animation');
    renderMovieList(animationList, $animationContainer, 'animation');
  
    const $modal = document.getElementById('modal');
    const $overlay = document.getElementById('overlay');
    const $hideModal = document.getElementById('hide-modal');
  
    const $modalTitle = $modal.querySelector('h1');
    const $modalImage = $modal.querySelector('img');
    const $modalDescription = $modal.querySelector('p');
  
    function findById(list, id) {
      return list.find(movie => movie.id === parseInt(id, 10))
    }
  
    function findMovie(id, category) {
      switch (category) {
        case 'action' : {
          return findById(actionList, id)
        }
        case 'drama' : {
          return findById(dramaList, id)
        }
        default: {
          return findById(animationList, id)
        }
      }
    }
  
    function showModal($element) {
      $overlay.classList.add('active');
      $modal.style.animation = 'modalIn .8s forwards';
      const id = $element.dataset.id;
      const category = $element.dataset.category;
      const data = findMovie(id, category);
  
      $modalTitle.textContent = data.title;
      $modalImage.setAttribute('src', data.medium_cover_image);
      $modalDescription.textContent = data.description_full
    }
  
    $hideModal.addEventListener('click', hideModal);
    function hideModal() {
      $overlay.classList.remove('active');
      $modal.style.animation = 'modalOut .8s forwards';
    }
  
    // ---------Comedy list exercise for playlist item----------
  
    const comedyList = await cacheExist('comedy')
  
    function myPlaylistItemTemplate (movie) {
      return (
        `<li class="myPlaylist-item">
          <a href="#">
            <span>
              ${movie.title}
            </span>
          </a>
        </li>`
      )
    }
  
    try {
      $comedyContainer.children[0].remove();
      comedyList.forEach(movie => {
        const HTMLString = myPlaylistItemTemplate(movie)
        const html = document.implementation.createHTMLDocument()
        html.body.innerHTML = HTMLString
        $comedyContainer.append(html.body.children[0])
        $comedyContainer.classList.add('fadeIn');
      }) 
    } catch (error) {
        throw new Error('No se encontró ningun resultado');
    }
    
  
    // ----------User random generator exercise for profiles-----------
  
    async function cacheUsersExist () {
      const listName = 'userList'
      const cacheList = localStorage.getItem(listName)//La propiedad de sólo lectura localStorage te permite acceder al objeto local Storage; los datos persisten almacenados entre de las diferentes sesiones de navegación.
      //El método getItem() de la interfaz Storage devuelve el valor de la clave cuyo nombre se le pasa por parámetro.
      if(cacheList) {
        return JSON.parse(cacheList)
      }
      const { results: usersList } = await getUsers('https://randomuser.me/')
      localStorage.setItem(listName, JSON.stringify(usersList))
      return usersList
    }
  
    const usersList = await cacheUsersExist()
    
    async function getUsers(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data
    }
    
    function playlistFriendsItemTemplate({ name: { first }, picture: { thumbnail } }) {
      return (
        `<li class="playlistFriends-item">
          <a href="#">
            <img src="${thumbnail}" alt="${first}" />
            <span>
              ${first}
            </span>
          </a>
        </li>`
      )
    }
  
    try {
      $usersContainer.children[0].remove();
      usersList.forEach(user => {    
        const HTMLString = playlistFriendsItemTemplate(user)
        const html = document.implementation.createHTMLDocument()
        html.body.innerHTML = HTMLString
        $usersContainer.append(html.body.children[0])
        $usersContainer.classList.add('fadeIn');
      })
    } catch (error) {
      throw new Error('No se pudieron encontrar usuarios')
    }
  
  })()