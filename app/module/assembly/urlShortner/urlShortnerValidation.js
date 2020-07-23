const constant         = require(__basePath + 'app/config/constant');
const validationHelper = require(constant.path.app + 'util/validation');
const responseHelper   = require(constant.path.app + 'util/response');
const underscore       = require('underscore');

exports.getAssets = function (req, res, next) {
    let headerSchema = {};

    let schema = {};

    let bodySchema = {
        customerId   : {
            notEmpty: true
        },
        responseType: {
            notEmpty: true
        },
        info: {
            notEmpty: false
        }
    };

    req.checkHeaders(headerSchema);
    req.checkParams(schema);
    req.checkBody(bodySchema);

    req.getValidationResult().then(function (result) {

        // Checking for validation errors
        if (false === result.isEmpty()) {
            return res.status(400).json(responseHelper.build(
                'ERROR_VALIDATION', validationHelper.parseValidationErrors(result.mapped())
            )).end();
        }

        next();
    });
};

exports.getLeadAssets = function (req, res, next) {
    let headerSchema = {};

    let schema = {};

    let bodySchema = {
        customerId   : {
            notEmpty: true
        },
        leadId   : {
            notEmpty: true
        },
        info : {
            notEmpty: false
        }
    }

    req.checkHeaders(headerSchema);
    req.checkParams(schema);
    req.checkBody(bodySchema);

    req.getValidationResult().then(function (result) {

        // Checking for validation errors
        if (false === result.isEmpty()) {
            return res.status(400).json(responseHelper.build(
                'ERROR_VALIDATION', validationHelper.parseValidationErrors(result.mapped())
            )).end();
        }

        next();
    });
};

exports.createShortUrl = function (req, res, next) {
    let headerSchema = {};

    let schema = {};

    let bodySchema = {
        url   : {
            notEmpty: true
        }
    }

    req.checkHeaders(headerSchema);
    req.checkParams(schema);
    req.checkBody(bodySchema);

    req.getValidationResult().then(function (result) {

        // Checking for validation errors
        if (false === result.isEmpty()) {
            return res.status(400).json(responseHelper.build(
                'ERROR_VALIDATION', validationHelper.parseValidationErrors(result.mapped())
            )).end();
        }

        next();
    });
};  

