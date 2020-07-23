const constant      = require(__basePath + 'app/config/constant');
const config        = require(constant.path.app + 'core/configuration');
const NodeException = require("node-exceptions");

//Services Exception
class Exception extends NodeException.LogicalException {
    constructor(ERROR_KEY = 'ERROR_SERVER_ERROR') {
        super();
        const error   = config.get(`APP_MESSAGES:${ERROR_KEY}`);
        this.message  = error.message;
        this.status   = error.statusCode;
        this.code     = error.errorCode;
        this.response = {};
    }
}


class ValidationErrorException extends Exception {
    constructor(response = {}) {
        super("ERROR_VALIDATION");

        this.response = response;
    }
}


class ClientConnectionTimeout extends Exception {
    constructor() {
        super("ERROR_CONNECTION_TIMEOUT");
    }
}



class InvalidAuthTokenException extends Exception {
    constructor() {
        super("INVALID_AUTH_TOKEN");
    }
}


/*
 * Error Handler 
 */
const errorHandler = function (err, req, res, next) {

    req.app.get('di').log.logger.error(err);

    return res.status(err.status || 500).json({
        status       : false,
        statusMessage: err.message,
        statusCode   : err.code,
        response     : err.response
    });
};

module.exports = {
    errorHandler                         : errorHandler,
    ValidationErrorException             : ValidationErrorException
};
