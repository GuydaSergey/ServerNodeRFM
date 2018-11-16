const net = require('net');
const BaseSocketManager = require("./baseSocketManager");
const redis_DB = require('../../redis_db').getInstanc();
const arr = require('../clientManager');


let _instanc = null;

class SocketDeviceManager extends BaseSocketManager {

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
                user.socket = socket;
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
    redis_DB.findData("users", user.Login).then(result => {
        if (result !== null && user.Pass === JSON.parse(result).Pass) {
            user.uid = JSON.parse(result).uid;
            findDevice(user);
            processDevice(user)
        } else  user.socket.end();
    });
}

function removeSocket(socket) {
    let user = arr.getArrUsers().find(el => {
        return el.socket === socket
    });
    if (user !== undefined) {
        user.socket = undefined;
    }
}

function processDevice(user) {
    if (arr.getArrUsers().length > 0) {
        arr.getArrUsers().forEach((el) => {
            if (user.uid === el.uid) {
                Object.assign(el, user);
            } else {
                findTasks(user.uid);
                user.socket.end();
            }
        });
    } else {
        findTasks(user.uid);
        user.socket.end();
    }

}

function findDevice(user) {
    redis_DB.findData("device", user.uid).then(result => {
        let masDevice = JSON.parse(result);
        let ex = masDevice.find(el => {
            return el.machineName === user.MachineName
        });
        if (ex === undefined) {
            masDevice.push({ip: user.socket.remoteAddress, machineName: user.MachineName});
        } else {
            masDevice.forEach(el => {
                if (el.machineName === user.MachineName)
                    el.ip = user.socket.remoteAddress;
            });
        }
        redis_DB.setData("device", user.uid, masDevice);
    });
}

function findTasks(uid) {

}

module.exports = {
    getInstanc: () => {
        return _instanc = _instanc !== null ? _instanc : new SocketDeviceManager()
    }
};