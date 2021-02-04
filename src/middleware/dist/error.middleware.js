"use strict";
exports.__esModule = true;
function errorMiddleware(error, request, response, next) {
    var status = error.status;
    var message = error.message;
    response.status(status).send({ status: status, message: message });
}
exports["default"] = errorMiddleware;
