/**
 * Created by Сергей on 06.09.2018.
 */
const clientManager = require('./managers/clientManager').getInstanc();

class Task {

    constructor(login) {
        this.temp = "";
        this.obj ={};
        this.client = clientManager.getClient(login);
        this.countRecev = 0;
    }

    getInfo(path, res) {
        new Promise((resolve) => {
            this.client.socket.on('data', this.callback.bind(this, resolve, res));
            this.client.socket.write(JSON.stringify({command: 2, body: path, cancelPackage: true}));
        }).then(() => {
            this.client.socket.removeAllListeners('data');
            res.end();
        });

    };

    uploadFile(path, res) {
        new Promise((resolve) => {
            this.client.socket.on('data', this.callback2.bind(this, resolve, res));
            res.setHeader('Content-Type', 'multipart/form-data');
            this.client.socket.write(JSON.stringify({command: 4, body: path, cancelPackage: true}));
        }).then(() => {
            res.end();
            this.client.socket.removeAllListeners('data');
        });

    };

    callback(resolve, res, data) {
        this.temp += data;
        try {
            this.obj = JSON.parse(this.temp);
            this.temp = "";
            res.write(JSON.stringify(this.obj).toString('utf16le'));
            resolve();
        }
        catch (err) {
        }
    }

    callback2(resolve, res, data) {
        this.temp += data.toString();
        try {
            this.obj = JSON.parse(this.temp);
            this.temp = "";
            this.client.socket.on('data', this.callback3.bind(this,resolve, res));
        }
        catch (err) {
            this.temp = ""

        }
    }

    callback3( resolve, res, data) {
        this.countRecev = this.countRecev+ data.length;
            res.write(data);
            if(this.countRecev === this.obj.length)
                resolve();
    }

}

module.exports = Task;