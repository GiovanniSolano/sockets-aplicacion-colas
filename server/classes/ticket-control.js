const fs = require('fs');

class Ticket {
    constructor(numero, escritorio) {

        this.numero = numero;
        this.escritorio = escritorio;

    }
}

class TicketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        let data = require('../data/data');

        if (data.hoy === this.hoy) {

            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;

        } else {

            this.reiniciarConteo();

        }


    }

    siguiente() {

        this.ultimo += 1;
        let ticket = new Ticket(this.ultimo, null);

        this.tickets.push(ticket);
        this.grabarArchivos();


        return `Ticket ${this.ultimo}`;

    }

    getUltimoTicket() {
        return `Ticket ${this.ultimo}`;
    }
    getUltimos4() {
        return this.ultimos4;
    }

    atenderTicket(escritorio) {

        if (this.tickets.length === 0) {
            return 'No hay tickets';
        }

        // romper la relacion de objetos por referencia
        let numeroTicket = this.tickets[0].numero;
        // Eliminar la primer posicion
        this.tickets.shift();


        // Nuevo ticket para atender
        let atenderTicket = new Ticket(numeroTicket, escritorio);


        // Agregar al inicio
        this.ultimos4.unshift(atenderTicket);

        // Sólo 4 tickets
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1); //ultimo
        }

        console.log('Ultimos 4');
        console.log(this.ultimos4);


        this.grabarArchivos();

        return atenderTicket;

    }

    reiniciarConteo() {

        this.ultimo = 0;
        this.tickets = [];
        this.ultimos4 = [];
        console.log('Se ha inicializado el sistema');

        this.grabarArchivos();





    }

    grabarArchivos() {

        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        };

        let jsonDataString = JSON.stringify(jsonData);
        fs.writeFileSync('./server/data/data.json', jsonDataString);

    }



}


module.exports = {
    TicketControl
}