console.log('hola mundo');
const noCambia = "horacio";
let cambia = "@horacio"

function cambiaNombre(nuevoNombre){
  cambia = nuevoNombre
}
const getUser = new Promise(function( todoBien, todoMal){
  setTimeout(function(){
    todoBien('time out');
  }, 5000)
  })
//esta es una promesa y la promesa es una variable constante que asu vez tiene una funcion con dos parametros
const getUserAll = new Promise(function( todoBien, todoMal){
//vamos a simular un delay cuando llamamos a la funcion, como si pideramos un api, esto lo haemos con setTimeout
//TIMERS: setinterval: este se ejecuta cada sierto tiempo, settimeout: se ejecuta una sola vez en determinado tiempo
setTimeout(function(){
  //colocamos 3000 para ejecutar lugo de 3 segundos
  todoBien('all good');
}, 3000)
})
//la priomesa debe tener metodos, lo hacemos com .then seria como decir 'entonces'?

// getUser
// .then(function(){//metodo para saber  que todo esta bien feed back que indica despues de3 segundo en este caso 
//   console.log('everyting is okey');
// })
// .catch(function(message){
//   console.log(message);
// })
//Promise.race se ejecuta la promesa que se resuelva primero con este metodo, osea que entramos al then que se resuelva primero
Promise.all ([
  getUser,
  getUserAll,
])
.then(function(message){
console.log(message);

})
.catch(function(message){
  console.log(message);
})
