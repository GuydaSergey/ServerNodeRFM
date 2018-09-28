/**
 * Created by Сергей on 24.09.2018.
 */

const Task = require('./Task');

module.exports = (dispatcher) => {

    dispatcher.onGet("/", function (req, res) {
        res.write("Hello API RemoteFIleManager");
        res.end();
    });

    dispatcher.onGet("/init", function (req, res) {

    });

    dispatcher.onGet("/get", function (req, res) {
        new Task(req.params.login).getInfo(req.params.path, res);
    });

    dispatcher.onGet("/upload", function (req, res) {
        new Task(req.params.login).uploadFile(req.params.path, res);
    });
};