"use strict";
exports.__esModule = true;
var express = require("express");
var post_model_1 = require("./post.model");
var PostException_1 = require("../exceptions/PostException");
var post_dto_1 = require("./post.dto");
var validation_middleware_1 = require("../middleware/validation.middleware");
var PostsController = /** @class */ (function () {
    function PostsController() {
        var _this = this;
        this.path = '/posts';
        this.router = express.Router();
        this.post = post_model_1["default"];
        this.getAllPosts = function (request, response) {
            _this.post.find().then(function (posts) {
                response.send(posts);
            });
        };
        this.getPostById = function (request, response, next) {
            var id = request.params.id;
            _this.post
                .findById(id)
                .then(function (post) { return response.send(post); })["catch"](function (err) { return next(new PostException_1["default"](id)); });
        };
        this.modifyPost = function (request, response, next) {
            var id = request.params.id;
            var postData = request.body;
            _this.post
                .findByIdAndUpdate(id, postData, { "new": true })
                .then(function (post) {
                response.send(post);
            })["catch"](function (err) {
                next(new PostException_1["default"](id)); // 带参数的 根据函数重载  处理为err
            });
        };
        this.createPost = function (request, response) {
            var postData = request.body;
            console.log(postData);
            var createdPost = new _this.post(postData);
            createdPost.save().then(function (savedPost) {
                response.send(savedPost);
                console.log(savedPost);
            });
        };
        this.deletePost = function (request, response, next) {
            var id = request.params.id;
            _this.post
                .findByIdAndDelete(id)
                .then(function (successResponse) {
                response.send(200);
            })["catch"](function (err) {
                next(new PostException_1["default"](id));
            });
        };
        this.intializeRoutes();
    }
    PostsController.prototype.intializeRoutes = function () {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(this.path + "/:id", this.getPostById);
        this.router.patch(this.path + "/:id", validation_middleware_1["default"](post_dto_1["default"], true), this.modifyPost);
        this.router["delete"](this.path + "/:id", this.deletePost);
        this.router.post(this.path, validation_middleware_1["default"](post_dto_1["default"]), this.createPost);
    };
    return PostsController;
}());
exports["default"] = PostsController;
