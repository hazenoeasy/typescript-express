"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var error_middleware_1 = require("./middleware/error.middleware");
var App = /** @class */ (function () {
    function App(controllers) {
        var _this = this;
        this.intializeMiddlewares = function () {
            _this.app.use(bodyParser.json());
        };
        this.intializeControllers = function (controllers) {
            controllers.forEach(function (controller) {
                _this.app.use('/', controller.router);
            });
        };
        this.intializeErrorhandling = function () {
            _this.app.use(error_middleware_1["default"]);
        };
        this.app = express();
        this.connectToTheDatabase();
        this.intializeMiddlewares();
        this.intializeControllers(controllers);
        this.intializeErrorhandling();
    }
    App.prototype.listen = function () {
        this.app.listen(process.env.PORT, function () {
            console.log("app listening on the posts " + process.env.PORT);
        });
    };
    App.prototype.connectToTheDatabase = function () {
        var _a = process.env, MONGO_USER = _a.MONGO_USER, MONGO_PASSWORD = _a.MONGO_PASSWORD, MONGO_PATH = _a.MONGO_PATH;
        mongoose.connect("mongodb://" + MONGO_USER + ":" + MONGO_PASSWORD + MONGO_PATH, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    };
    return App;
}());
exports["default"] = App;
