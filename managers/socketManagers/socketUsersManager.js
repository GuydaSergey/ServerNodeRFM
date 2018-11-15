const net = require('net');
const BaseSocketManager = require("./baseSocketManager");
const Task = require('../../Task');

// let _instanc = null;

class SocketUsersManager extends BaseSocketManager {

    constructor() {
        super();
    }

    init(port) {
        this.server.listen(port, () => {
            console.log('Started users socket server on ' + port);
        });

    }

    initSocket(socket) {
        socket.once('data', (function (data) {
            let obj = JSON.parse(data.toString('utf16le'));
            obj.socket = socket;
            new Promise(() => new Task().runTask(obj));
        }));
        socket.once('error', (function (data) {
        }));
    };
}

module.exports = SocketUsersManager;
//     {
//     getInstanc: () => {
//         return _instanc = _instanc !== null ? _instanc : new SocketUsersManager()
//     }
// };