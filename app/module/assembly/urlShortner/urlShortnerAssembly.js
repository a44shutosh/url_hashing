const constant              = require(__basePath + '/app/config/constant');
const response              = require(constant.path.app + 'util/response');
const utility               = require(constant.path.app + 'util/utility');
const config                = require(constant.path.app + 'core/configuration');
const urlShortnerModel        = require(constant.path.app + 'module/model/database/urlShortnerModel');
const async                 = require('async');
const moment                = require('moment');
const {logger}              = require(constant.path.app + 'core/logger');
const underscore            = require('underscore');

const urlShortnerObj              = new urlShortnerModel();

/*
 * create shortUrl 
 * @param {object} req
 * @param {object} res
 * @returns {json}
 */
exports.createShortUrl = function (req, res, next) {
    
    logger.info('[%s createUrl] get Assets request with params: %s ', "urlHashing",JSON.stringify(req.body));

    let url = req.body.url;

    let urlShort = "http://urlHashingapp.com/" + utility.uuid();

    let createUrlRequest ={ url , urlShort};

    let getUrl = function ( callback) {
       
        urlShortnerObj.getUrlData(url, function (error, result, body) {

            if (error) {
                return callback(error);
            }
            return callback(null, result);

        });
    }
 
    let createurl = function (getUrlData ,callback) {

        if(utility.isEmpty(getUrlData) === false){
            return callback(null, getUrlData);
        }
       
        urlShortnerObj.insertUrl(createUrlRequest, function (error, result, body) {

            if (error) {
                return callback(error);
            }
            
            return callback(null, {urlShort});

        });
    }

    async.waterfall([
        getUrl,
        createurl
    ], function (error, result) {
        if (error) {
            return res.status(500).json(response.build('ERROR_SERVER_ERROR', {error: error}));
        }

        if (result.statusCode == 500) {
            return res.status(404).json(response.build('ASSET_EXECEPTION_ERROR', result));
        }

        if (result.length === 0) {
            return res.status(200).json(response.build('ERROR_NO_DATA', result));
        }
        logger.info('[%s %s] Returned with status [%s].', "urlHashing", 'createShortUrl', 200);

        return res.status(200).json(response.build('SUCCESS', {"shortUrl" : urlShort}));

    });
};
/*
 * get primaryUrl 
 * @param {object} req
 * @param {object} res
 * @returns {json}
 */
exports.getPrimaryUrl = function(req, res) {    
    logger.info('[getPrimaryUrl]', req.query.shortUrl);
    let shortUrl      = req.query.shortUrl;

    let getPrimaryUrl = function ( callback) {
       
        urlShortnerObj.getUrlByShortUrl(shortUrl, function (error, result, body) {

            if (error) {
                return callback(error);
            }
            return callback(null, result);

        });
    }

    async.waterfall([
        getPrimaryUrl
    ], function(error, result){
        if(error) {
            return res.status(500).json(response.build('ERROR_SERVER_ERROR', error));
        }

        if (result.length === 0) {
            return res.status(200).json(response.build('ERROR_NO_DATA', result));
        }

        return res.status(200).json(response.build('SUCCESS', result[0]));
    });
}
