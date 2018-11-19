var socket = io();
var params = new URLSearchParams(window.location.search);

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
    //alert(`usuario: ${mensaje.nombre} , mensaje : ${mensaje.mensaje}`);
});



socket.on('listaPersonas', function(personas) {
    console.log(personas);
})


//Mensajes privaos
socket.on('mensajesPrivado', function(mensajes) {
    console.log("privado", mensajes);

});