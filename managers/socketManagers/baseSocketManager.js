/**
 * Created by Сергей on 13.11.2018.
 */
const net = require('net');

class BaseSocketManager {
    constructor() {
        this.server = net.createServer({allowHalfOpen: true}, (socket) => {
            new Promise(() => this.initSocket(socket));
        }).on('error', (err) => {
        });
    }

}

module.exports = BaseSocketManager;