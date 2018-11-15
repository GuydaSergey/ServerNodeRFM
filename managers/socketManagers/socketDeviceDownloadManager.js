/**
 * Created by Сергей on 13.11.2018.
 */
const BaseSocketManager = require("./baseSocketManager");
const arr = require('../clientManager');

let _instanc = null;

class SocketDeviceDownload extends BaseSocketManager {
    constructor() {
        super();
    }

    init(port) {
        this.server.listen(port, () => {
            console.log('Started device socket server');
        });

    }

    initSocket(socket) {
        socket.once('data', (function (data) {
            let user = JSON.parse(data.toString('utf16le'));
            user.socketDownload = socket;
            new Promise(() => addSocket(user));
        }));
        socket.once('close', (function () {
            removeSocket(socket);
        }));
        socket.once('error', (function (data) {
        }));
    };

}

function addSocket(user) {
    if (arr.getArrUsers().length > 0) {
        arr.getArrUsers().forEach((el) => {
            if (user.Login === el.Login) {
                Object.assign(el, user);
            } else {
                user.socketDownload.end();
            }
        });
    } else {
        user.socketDownload.end();
    }
}

function removeSocket(socket) {
    let user = arr.getArrUsers().find(el => {
        return el.socketDownload === socket
    });
    if (user !== undefined) {
        user.socketDownload = undefined;
    }
}

module.exports = {
    getInstanc: () => {
        return _instanc = _instanc !== null ? _instanc : new SocketDeviceDownload()
    }
};