/**
 * Created by Сергей on 04.09.2018.
 */
const emitter = require('../eventEmitter').getInstanc();
const uid = require('uid');

let _instanc = null;
let arrClientConnect = [];
class ClientManager {

    constructor(){
    }

    init(){
        emitter.onEvent("AddSocketConnect", this.addSocketConnect);
        emitter.onEvent( "1" ,this.initClientSocket.bind(this) );
    }

    addSocketConnect(socket){
        let ex = arrClientConnect.find((cl) => cl.socket.remoteAddress === socket.remoteAddress);
        if (ex === undefined) {
            arrClientConnect.push({ socket:socket});
        }
        else {
            ex.socket = socket;
        }
    };

    initClientSocket (data) {
        let user =  JSON.parse(data.body);
         arrClientConnect.forEach((cl)=>{
            let endPoint = cl.socket.remoteAddress.toString().split(':')[3] +':'+ cl.socket.remotePort;
            if( endPoint === user.EndPoint) {
               Object.assign(cl,user);
               this.responseOK(cl.socket);
            }
        });
    };

    responseOK ( socket ) {
        socket.write( JSON.stringify({ command:5,body:"",cancelPackage: true}));
    };

    getClient ( token ){
        return arrClientConnect.find((cl) => cl.Login === token);
    }
}

module.exports = {
    getInstanc: () => {
        return _instanc = _instanc !== null ? _instanc : new ClientManager()
    }
};

