var socket = io(); // conection con el server
//Funciones para rederizar usuarios

var params = new URLSearchParams(window.location.search);
var contenidoHtml = $("#divUsuarios");
var formEnviarMensaje = $("#formEnviarMensaje");
var txtMensaje = $("#txtMensaje");
var divChatbox = $("#divChatbox");

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};



var renderizarUsuario = function(personas) {
    var html = '';
    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + usuario.sala + '</span></a>';
    html += '</li>';

    for (c = 0; c < personas.length; c++) {
        html += '<li>';
        html += '<a data-id="' + personas[c].id + '" href="javascript:void(0)"><img src="assets/images/users/' + (c + 1) + '.jpg" alt="user-img" class="img-circle"> <span>' + personas[c].nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }
    contenidoHtml.html(html);
}

var rendirizarMensajes = function(mensaje, yo) {
    var htmlMensajes = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    var adminClass = 'info';
    if (mensaje.nombre === "Administrador") {
        adminClass = 'danger';
    }
    if (!yo) {
        htmlMensajes += '<li class="animated fadeIn">';
        htmlMensajes += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        htmlMensajes += '<div class="chat-content">';
        htmlMensajes += '<h5>' + mensaje.nombre + '</h5>';
        htmlMensajes += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        htmlMensajes += '</div>';
        htmlMensajes += ' <div class="chat-time">' + hora + '</div>';
        htmlMensajes += '</li>';
    } else {
        htmlMensajes += '<li class="reverse">';
        htmlMensajes += '<div class="chat-content">';
        htmlMensajes += '    <h5>' + mensaje.nombre + '</h5>';
        htmlMensajes += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        htmlMensajes += '</div>';
        htmlMensajes += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        htmlMensajes += '<div class="chat-time">' + hora + '</div>';
        htmlMensajes += '</li>';
    }


    divChatbox.append(htmlMensajes);
};


var scrollBottom = function() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// listener
contenidoHtml.on('click', 'a', function() {
    var id = $(this).data('id'); // obtiene el valor del a que se l dio clic
    if (id) {
        console.log(id);
    }
});
formEnviarMensaje.on('submit', function(e) {
    e.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        return;
    }
    // Enviar información
    socket.emit('crearMensaje', {
        sala: usuario.sala,
        usuario: usuario.nombre,
        mensaje: txtMensaje.val()
    }, function(resp) {
        if (resp.mensaje) {
            console.log('respuesta server: ', resp);
            txtMensaje.val('').focus();
            rendirizarMensajes(resp, true);
            scrollBottom();
            console.log('Mensaje enviado');

        }

    });

});