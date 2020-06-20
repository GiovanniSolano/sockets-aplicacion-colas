const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketcontrol = new TicketControl();


io.on('connection', (client) => {

    client.on('siguienteTicket', (data, callback) => {

        let siguiente = ticketcontrol.siguiente();

        console.log(siguiente);
        callback(siguiente);

    });

    // Emitir evento estadoActual

    client.emit('estadoActual', {
        actual: ticketcontrol.getUltimoTicket(),
        ultimos4: ticketcontrol.getUltimos4()
    });

    client.on('atenderTicket', (data, callback) => {

        if (!data.escritorio) {
            return callback({

                err: true,
                mensaje: 'El escritorio es obligatorio'
            });
        }

        let atenderTicket = ticketcontrol.atenderTicket(data.escritorio);

        callback(atenderTicket);

        //Actualizar / notificar cambios en los ultimos 4
        client.broadcast.emit('ultimos4', {
            ultimos4: ticketcontrol.getUltimos4()
        });

    });

});