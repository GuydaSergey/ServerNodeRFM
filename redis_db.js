/**
 * Created by Сергей on 07.11.2018.
 */
const bluebird = require('bluebird');
const redis = require('redis');
const uid = require('uid');
const convert = require('object-array-converter');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let _instanc = null;

class Redis_DB {
    constructor() {
        this.client = null;
    }

    init() {
        this.client = redis.createClient();
        this.client.on("connect", function () {
            console.log("Connect DB ");
        });
    }

    findData(key, hash) {
        return this.client.hgetAsync(key, hash);
    }

    setData(key, hash, value) {
        this.client.hmset(key, hash, JSON.stringify(value));
    }

    registerUser(user) {
        return this.findData("users", user.Login).then(odj => {
            if (odj === null) {
                user.uid = uid(10);
                this.setData("users", user.Login, user);
                this.setData("device", user.uid, []);
                this.setData("history", user.uid, []);
            } else {
                return null;
            }
            return user.uid;
        });
    }

    initUser(uid) {
        return this.client.hgetallAsync("users").then(masUser => {
            let tp = null;
            convert.toArray(masUser).forEach((el) => {
                if (JSON.parse(el.value).uid === uid)
                    tp = JSON.parse(el.value);
            });
            return tp;
        });
    }


}


module.exports = {
    getInstanc: () => {
        return _instanc = _instanc !== null ? _instanc : new Redis_DB()
    }
};