/**
 * Created by Сергей on 04.09.2018.
 */
const redis_DB = require('../redis_db').getInstanc();


let _instanc = null;
let arrUsersConnect = [];

class ClientManager {

    constructor(){

    }

    init(){

    }

    registUser(user) {
     return  redis_DB.registerUser(user).then( result =>{
           if(result !== null){
               redis_DB.initUser(result).then(res => {
                   this.initUser(res);
               });
           }
         return result;
       });
    }

    initUser (user) {
       return  redis_DB.findData("users",user.Login).then( result =>{
           let  tmp = null;
           if(result !== null) {
               tmp = JSON.parse(result);
               if(user.Pass === tmp.Pass) {
                   let ex = arrUsersConnect.find((el) => { return el.uid === tmp.uid });
                   if (ex === undefined) {
                       arrUsersConnect.push(tmp);
                   }
                   return tmp.uid;
               }
           }
           return tmp;
       });
    };

    getUser(uid){
        let user = arrUsersConnect.find(el => { return el.uid === uid});
        if(user !== undefined){
            if(user.socket === undefined) {
                user = undefined;
            }
        }
        return user
    }
}

module.exports = {
    getInstanc: () => {
        return _instanc = _instanc !== null ? _instanc : new ClientManager()
    },
    getArrUsers:()=>{
        return arrUsersConnect;
    }
};

