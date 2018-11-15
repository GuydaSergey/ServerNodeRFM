/**
 * Created by Сергей on 13.11.2018.
 */
const BaseSocketManager = require("./baseSocketManager");
const arr = require('../clientManager');

let _instanc = null;

class SocketDeviceUploadManager extends BaseSocketManager {
    constructor() {
        super();
    }

    init(port) {
        this.server.listen(port, () => {
            console.log('Started device socket server');
        });

    }

    initSocket(socket) {
        socket.once('data', function (data) {
            try {
            let user = JSON.parse(data.toString('utf16le'));
            user.socketUpload = socket;
            new Promise(() => addSocket(user));
            }catch (err){
                socket.destroy()
            }
        });
        socket.once('close', function () {
            new Promise(() => removeSocket(socket));
        });
        socket.once('error', function (data) {
        });
    };

}

function addSocket(user) {
    if (arr.getArrUsers().length > 0) {
        arr.getArrUsers().forEach((el) => {
            if (user.Login === el.Login) {
                Object.assign(el, user);
            } else {
                user.socketUpload.end();
            }
        });
    } else {
        user.socketUpload.end();
    }
}

function removeSocket(socket) {
    let user = arr.getArrUsers().find(el => {
        return el.socketUpload === socket
    });
    if (user !== undefined) {
        user.socketUpload = undefined;
    }
}

module.exports = {
    getInstanc: () => {
        return _instanc = _instanc !== null ? _instanc : new SocketDeviceUploadManager()
    }
};