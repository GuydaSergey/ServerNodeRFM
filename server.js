/**
 * Created by Сергей on 29.08.2018.
 */

const server = require('http').createServer();
const Http_Dispatcher = require('httpdispatcher');
const dispatcher = new Http_Dispatcher();
require('./route')(dispatcher);

let _instanc = null;

class Server {

    constructor(){
        server.listen(3000, function () {
            console.log("API Started");
        });
    }

    init()  {

        server.on("request",function (req ,res) {
            dispatcher.dispatch(req,res);
        })
    }


}

 module.exports = {
    getInstanc: () => {
        return _instanc = _instanc !== null ? _instanc : new Server()
    }
};