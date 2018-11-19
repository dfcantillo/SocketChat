var params = new URLSearchParams(window.location.search);
var socket = io(); // conection con el server
if (!params.has('nombre') || !params.has('sala')) {
    window.location = "index.html"
    throw new Error("Debe ingresar el nombre del usuario y la sala");
    // return;
}
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};
socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function(respuesta) {
        console.log("usuario Conectado", respuesta);
        renderizarUsuario(respuesta, false); //para poner la respuesta de otros
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('enviarMensaje', {
//     usuario: 'Diego',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
    rendirizarMensajes(mensaje);
    scrollBottom();
    //alert(`usuario: ${mensaje.nombre} , mensaje : ${mensaje.mensaje}`);
});



socket.on('listaPersonas', function(personas) {
    console.log(personas);
    renderizarUsuario(personas);
})


//Mensajes privaos
socket.on('mensajesPrivado', function(mensajes) {
    console.log("privado", mensajes);

});