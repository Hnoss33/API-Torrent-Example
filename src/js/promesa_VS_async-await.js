

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
