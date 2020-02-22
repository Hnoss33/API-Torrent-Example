// console.log('hola mundo');
// const noCambia = "horacio";
// let cambia = "@horacio"

// function cambiaNombre(nuevoNombre){
//   cambia = nuevoNombre
// }
// const getUser = new Promise(function( todoBien, todoMal){
//   setTimeout(function(){
//     todoBien('time out');
//   }, 5000)
//   })
// //...esta es una promesa y la promesa es una variable constante que asu vez tiene una funcion con dos parametros
// const getUserAll = new Promise(function( todoBien, todoMal){
// //...vamos a simular un delay cuando llamamos a la funcion, como si pideramos un api, esto lo haemos con setTimeout
// //...TIMERS: setinterval: este se ejecuta cada sierto tiempo, settimeout: se ejecuta una sola vez en determinado tiempo
// setTimeout(function(){
//   //...colocamos 3000 para ejecutar lugo de 3 segundos
//   todoBien('all good');
// }, 3000)
// })
//...la priomesa debe tener metodos, lo hacemos com .then seria como decir 'entonces'?

// getUser
// .then(function(){//metodo para saber  que todo esta bien feed back que indica despues de3 segundo en este caso 
//   console.log('everyting is okey');
// })
// .catch(function(message){
//   console.log(message);
// })
//Promise.race se ejecuta la promesa que se resuelva primero con este metodo, osea que entramos al then que se resuelva primero
// Promise.all ([
//   getUser,
//   getUserAll,
// ])
// .then(function(message){
// console.log(message);

// })
// .catch(function(message){
//   console.log(message);
// })
//peticion AJAX para traer datos, en este caso es un usuario random
// $.ajax('https://randomuser.me/api/',{
//   method: 'GET',
//   success: function(data){
//     console.log(data);
//   },
//   error: function(error){
// console.log(error);
// }
// })

//esta es la version "javascript" para trer usuarios desde el servidor con fetch
// fetch('https://randomuser.me/api/786767')
// .then(function(response){
//   return response.json()
// })
// .then(function(user){
//   //en la linea 62 llamamos al resultado primero del array en este caso es el primer nombre del usuario
//   console.log('user', user.results[0].name.first)
// // console.log('user', user); //aca llamamos a los datos del usuario completos
// })
// .catch(function(){
//   console.log('Something is wrong');
// }); //importante este punto y coma, si no se coloca, coge la funcion de abajo como mparte de la primera promesa

//api the YTS---->
(async function load(){ //el async esta envuelto en parentecis ya que se auto llama con el load, 
//esta palabra reservada hace que espere la peticion de la API (await)
//=await espera la peticion del api
async function getData (url){ //aca getData nos esta devolviendo una promesa porque hace await 
 const response = await fetch(url);
 const data = await response.json()
 return data;
}
 const actionList = await getData ('https://yts.lt/api/v2/list_movies.json?genre=action') //este codigo es con async await 
 
 let terrorList; //aca ejecutamos lo mismo de arriba pero con promesas y la promesa tiene un .then que llama a la data que llama a la lista de terror
 getData ('https://yts.lt/api/v2/list_movies.json?genre=terror')
 .then(function(data){
 console.log('terrorList', data);
 terrorList = data;
 })

 console.log('actionList', actionList);
 
 })()
 //en este codigo creamos una funcion asincrona y la volvemos sincrona utilizando el await
 //hasta que no se resuelva el tech no se invoca el json()esto es posible con el await
//load() //si arriba no envolvemos el async podemos llamar el load desde aca 
//await solo funciona cuando una funcion es asincrona ejemplo = async function getData()
