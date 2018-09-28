/**
 * Created by Сергей on 03.09.2018.
 */
const socketManager = require('./socketManager').getInstanc();
const clientManager = require('./clientManager').getInstanc();
const Server = require('../server').getInstanc();

let _instanc = null;

class AppManager {
    constructor() {
        clientManager.init();
        Server.init();
        socketManager.init();
    }
}


module.exports = {
    getInstanc: () => {
        return _instanc = _instanc !== null ? _instanc : new AppManager()
    }
};