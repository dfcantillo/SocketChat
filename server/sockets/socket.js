const { io } = require('../server');
const { Usuarios } = require('../classes/usuario');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();
io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on("entrarChat", (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es obligatorio'
            })
        }

        //Conection a una sala o creación
        client.join(data.sala);

        let persona = usuarios.agregarPersona(client.id, data.nombre, data.sala);
        // client.broadcast.emit('listaPersonas', usuarios.getPersonas());
        //Enviar mensaje a una sola especifica
        // client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonas());
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit("crearMensaje", crearMensaje('Administrador', `${data.nombre} se ha unido del chat`));

        // console.log("Sala: ", data.sala);
        callback(usuarios.getPersonasPorSala(data.sala));
    });

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
        // client.broadcast.emit('crearMensaje', mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.eliminarPersona(client.id);
        console.log(personaBorrada + " id:" + client.id);
        if (personaBorrada) {
            client.broadcast.to(personaBorrada.sala).emit("crearMensaje", crearMensaje('Administrador', `${personaBorrada.nombre} se ha desconectado del chat`));
            client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
        }


    });


    //Mensajes Privados
    client.on("mensajesPrivado", (data) => {

        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajesPrivado', crearMensaje(persona.nombre, data.mensaje));

    });



});