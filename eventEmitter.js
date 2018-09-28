/**
 * Created by Сергей on 31.08.2018.
 */

let _instanc = null;

class eventEmitter {

    constructor(){
        this.arrEvent = [];
    }

    onEvent(event, func) {
        if (!this.arrEvent.some((el) => el.event === event.toString())) {
            this.arrEvent.push({event: event, arrFunc:[] });
        }
        this.arrEvent.find((el) => el.event === event.toString()).arrFunc.push(func);
    };

    eventEmit(event, data) {
        if (this.arrEvent.some((el) => el.event === event)) {
            this.arrEvent.find((el) => el.event === event.toString()).arrFunc.forEach((func) => {
                        func(data);
                    });
        }
    };
}

module.exports = {
    getInstanc: () => {
        return _instanc = _instanc !== null ? _instanc : new eventEmitter()
    }
};
