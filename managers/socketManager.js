const net = require('.net');
const emitter = require('../eventEmitter').getInstanc();


let _instanc = null;

class SocketManager {

    constructor(){
        this.server = null;
    }

    init() {
        this.server = net.createServer((socket) => {
            console.log('New connection from ' + socket.remoteAddress);
            this.initSocket(socket);
            emitter.eventEmit("AddSocketConnect",socket)
        }).on('error', (err) => {
            console.log(err);
        });
        this.server.listen(3333, () => {
            console.log('opened server on', this.server.address());
        });
    }

    initSocket (socket) {
        socket.once('data', (function (data) {
            let command = JSON.parse(data);
            emitter.eventEmit("" + command.command, command);
        }));
        socket.on('error', (function (data) {
            console.log(data);
        }));
    };
}
module.exports = {
    getInstanc: () => {
        return _instanc = _instanc !== null ? _instanc : new SocketManager()
    }
};