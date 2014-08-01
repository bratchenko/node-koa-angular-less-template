module.exports = {
    NotFound: NotFound,
    BadRequest: BadRequest,
    Unauthorized: Unauthorized,
    Forbidden: Forbidden
};

function NotFound(message) {
    this.name = 'NotFoundError';
    this.message = message || "Not Found";
    this.stack = (new Error()).stack;
    this.status = 404;
}
NotFound.prototype = new Error();

function BadRequest(message) {
    this.name = 'BadRequestError';
    this.message = message || "Bad Request";
    this.stack = (new Error()).stack;
    this.status = 400;
}
BadRequest.prototype = new Error();

function Unauthorized(message) {
    this.name = 'UnauthorizedError';
    this.message = message || "Unauthorized";
    this.stack = (new Error()).stack;
    this.status = 401;
}
Unauthorized.prototype = new Error();

function Forbidden(message) {
    this.name = 'ForbiddenError';
    this.message = message || "Forbidden";
    this.stack = (new Error()).stack;
    this.status = 403;
}
Forbidden.prototype = new Error();
