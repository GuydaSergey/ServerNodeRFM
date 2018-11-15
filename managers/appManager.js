/**
 * Created by Сергей on 03.09.2018.
 */
const SocketDeviceManager = require('./socketManagers/socketDeviceManager').getInstanc();
const SocketUsersManager = require('./socketManagers/socketUsersManager');
const SocketUsersDownloadManager = new SocketUsersManager();
const SocketUsersUploadManager = new SocketUsersManager();
const SocketDeviceUploadManager = require('./socketManagers/socketDeviceUploadManager').getInstanc();
const SocketDeviceDownloadManager = require('./socketManagers/socketDeviceDownloadManager').getInstanc();
const ClientManager = require('./clientManager').getInstanc();
const Server = require('../server').getInstanc();
const Redis_DB = require('../redis_db').getInstanc();

let _instanc = null;

class AppManager {
    constructor() {
        Redis_DB.init();
        ClientManager.init();
        Server.init();
        SocketUsersDownloadManager.init(3001);
        SocketUsersUploadManager.init(3002);
        SocketDeviceManager.init(3333);
        SocketDeviceUploadManager.init(3334);
        SocketDeviceDownloadManager.init(3335);
    }
}


module.exports = {
    getInstanc: () => {
        return _instanc = _instanc !== null ? _instanc : new AppManager()
    }
};