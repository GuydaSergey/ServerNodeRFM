/**
 * Created by Сергей on 06.09.2018.
 */
const clientManager = require('./managers/clientManager').getInstanc();

class Task {

    constructor() {
        this.client = null;
        this.workerSocket = null;
    }

    runTask(obj, res) {
        new Promise((resolve) => {
            this.client = clientManager.getUser(obj.Uid);
            if (obj.socket === undefined)
                obj.socket = res;
            let user = {Login: obj.Login, Pass: obj.Pass};
            if (obj.Command.includes("REGISTRATION")) {
                clientManager.registUser(user).then(result => {
                    if (result !== null)
                        obj.socket.write(result);
                    resolve();
                }).catch(err => {
                    console.log(err);
                    resolve();
                })

            } else if (obj.Command.includes("INIT")) {
                clientManager.initUser(user).then(result => {
                    if (result !== null)
                        obj.socket.write(result);
                    resolve();
                }).catch(err => {
                    console.log(err);
                    resolve();
                })

            } else if (obj.Command.includes("LOGOFF")) {

                clientManager.removeUser(obj.Uid).then(() => {
                    resolve();
                }).catch(err => {
                    console.log(err);
                    resolve();
                })

            } else if (obj.Command.includes("INFO") && this.client !== undefined) {

                this.workerSocket = this.client.socket;
                this.workerSocket.on('data', this.getInfo.bind(this, resolve, obj.socket));


            } else if (obj.Command.includes("DELETE") || obj.Command.includes("MOVETO")) {

                setTimeout(() => resolve(), 1000);

            } else if (obj.Command.includes("UPLOAD") && this.client !== undefined) {

                this.workerSocket = this.client.socketUpload;
                this.workerSocket.on('data', this.getFile.bind(this, resolve, obj.socket));


            } else if (obj.Command.includes("DOWNLOAD") && this.client !== undefined) {

                this.workerSocket = obj.socket;
                this.workerSocket.on('data', this.setFile.bind(this, resolve, this.client.socketDownload));

            } else {
                resolve();
            }

            if (this.client !== undefined)
                this.client.socket.write(JSON.stringify({command: obj.Command, body: obj.Body}), 'utf16le');
        }).then(() => {
            if (this.workerSocket !== null) {
                this.workerSocket.removeAllListeners('data');
            }
            obj.socket.end();
        }).catch(err => {
            console.log(err)
        });
    };

    getInfo(resolve, res, data) {
        if (data.toString('utf16le').includes("{end:true}")) {
            data = Buffer.from(data.toString('utf16le').replace("{end:true}", ""), 'utf16le');
            res.write(data.toString('utf16le'));
            resolve();
        }
        else
            res.write(data.toString('utf16le'));

    }

    getFile(resolve, res, data) {
        if (data.toString().includes("{end:true}")) {
            data = Buffer.alloc(data.length - 10, data);
            res.write(data);
            resolve();
        }
        else if (!res.destroyed)
            res.write(data);
    }

    setFile(resolve, res, data) {
        if (data.toString().includes("{end:true}")) {
            res.write(data);
            resolve();
        }
        else if (!res.destroyed)
            res.write(data);
    }

}

module.exports = Task;
