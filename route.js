/**
 * Created by Сергей on 24.09.2018.
 */

const Task = require('./Task');

module.exports = (dispatcher) => {

    dispatcher.onGet("/", function (req, res) {
        res.end("Hello API RemoteFIleManager");
    });

    dispatcher.onGet("/registr", function (req, res) {
        new Task().runTask(req.params, res);
    });

    dispatcher.onGet("/init", function (req, res) {
        new Task().runTask(req.params, res);
    });

    dispatcher.onGet("/get", function (req, res) {
        new Task().runTask(req.params, res);
    });
};