const constant   = require(__basePath + 'app/config/constant');
const underscore = require('underscore');
const uuIdv4     = require('uuid/v4');
const moment     = require('moment');
const {logger}   = require(constant.path.app + 'core/logger');
const crypto     = require('crypto');

const utility = {};

/**
 * Generate a valid V4 UUID
 * @return string
 */
utility.uuid = function () {
    return uuIdv4();
};

/**
 * check string is valid or return default value
 * @param {string} value
 * @param {string} defaultValue
 *
 * @return string
 */
utility.validOrDefault = function (value, defaultValue = '') {
    return (utility.isEmpty(value) === false) ? value : defaultValue;
};

/**
 * Generate Otp
 *
 * @return int
 */
utility.generateOtp = function () {
    return underscore.random(100000, 999999);
};

/**
 * Check any object, array, string, number, boolean is empty or not.
 *
 * @param obj
 * @return {boolean}
 */
utility.isEmpty = function (obj) {
    if (underscore.isNumber(obj) || underscore.isBoolean(obj)) {
        return false;
    }

    return underscore.isEmpty(obj);
};

/**
 * check variable is exit or not
 *
 * @return boolean
 */
utility.isset = function (params) {
    return typeof params !== 'undefined';
};

/**
 * get date different in (Years/months/days)
 *
 * @return number
 * @param date1
 * @param date2
 * @param differentFormat
 */
utility.dateDifference = function (date1, date2 = new Date(), differentFormat = 'years') {
    let startDate = moment(date1).format('YYYY-MM-DD');
    let endDate   = moment(new Date()).format("YYYY-MM-DD");

    return moment(endDate).diff(startDate, differentFormat);
};

/**
 * get time different in (days/hours/minutes/second)
 *
 * @return number
 * @param date1
 * @param date2
 * @param differentFormat
 */
utility.timeDifference = function (date1, date2 = new Date(), differentFormat = 'hours') {
    var startDate = moment(date1, 'YYYY-M-DD HH:mm:ss');
    var endDate = moment(date2, 'YYYY-M-DD HH:mm:ss');

    return endDate.diff(startDate, differentFormat);
};

utility.encryptString = function (plaintext, secretKey, iv) {
    try{
        let padding = 16 - (plaintext.length % 16);
        plaintext   = plaintext + "_".repeat(padding);

        let cipher = crypto.createCipheriv('aes-128-cbc', secretKey, new Buffer(iv));
        return cipher.update(plaintext, 'utf8', 'base64') + cipher.final('base64');
    }catch(error){
        logger.error('encryptString Error ' + error);
    }
};

utility.encryptStringFixedDeposit = (plainText, encryptionKey, encryptionIv) => {
    // try{
    //     let cipher      = crypto.createCipheriv('aes-128-cbc', encryptionKey, encryptionIv);
    //     let encrypted   = cipher.update(plainText, 'utf8', 'binary');
    //     encrypted       += cipher.final('binary');
    //     hexVal          = new Buffer(encrypted, 'binary');
    //     let jsonObject = {'encryptionKey' :encryptionKey ,'encryptionIv' :encryptionIv,'hexVal': hexVal,'encrypted': encrypted, 'cipher': cipher};
    //     logger.info("encryptStringFixedDeposit :",JSON.stringify(jsonObject));
    //     return  hexVal.toString('hex');
    // }catch(error){
    //     logger.error('encryptStringFixedDeposit Error ' + error);
    // }
    return "encryptvalue";
 };

utility.decryptString = function (plaintext, secretKey, iv) {

    let decipher = crypto.createDecipheriv('aes-128-cbc', secretKey, iv);
    decipher.setAutoPadding(false);
    return decipher.update(plaintext, 'base64', 'utf8');
};

/**
 * data encrypt AES-256-CBC
 *
 * @param data
 * @param key
 * @param iv
 * @return string/null
 */
utility.encryptAES256CBC = function (data, key, iv) {
    try {
        let cipher    = crypto.createCipheriv('aes-256-cbc', key, new Buffer(iv));
        let encrypted = cipher.update(data, 'utf8', 'binary') + cipher.final('binary');

        return new Buffer(encrypted, 'binary').toString('base64');
    } catch (error) {
        logger.error(error.message);
    }

    return null;
};

/**
 * data decrypt AES-256-CBC
 * @param data
 * @param key
 * @param iv
 * @return string/null
 */
utility.decryptAES256CBC = function (data, key, iv) {
    try {
        let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        return decipher.update(data, 'base64', 'binary') + decipher.final('binary');
    } catch (error) {
        logger.error(error.message);
    }

    return null;
};

/**
 * Base 64 encode
 * @param data
 * @returns {String}
 */
utility.base64Encode = function (data) {
    if (utility.isEmpty(data) === true) {
        return data;
    }

    let buffer = new Buffer(data);
    return buffer.toString('base64');
};

/**
 * Base 64 decode
 * @param data
 * @returns {String}
 */
utility.base64Decode = function (data) {
    if (utility.isEmpty(data) === true) {
        return data;
    }

    let buffer = new Buffer(data, 'base64');
    return buffer.toString();
};

/**
 * Convert object to query string
 * @return string
 */
utility.object2QueryString = function (obj, prefix, removeEmptyValues) {
    var str = [],
        p;
    for (p in obj) {

        if (true === removeEmptyValues && underscore.isEmpty(obj[p])) {
            continue;
        }
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
};

utility.getDeviceType = function (userAgent) {
    userAgent = userAgent.toLowerCase();
    if (userAgent.indexOf("posix") !== -1 || userAgent.indexOf("mobile") !== -1 || userAgent.indexOf("bb10") !== -1 || userAgent.indexOf("fennec") !== -1 || userAgent.indexOf("blackberry") !== -1 || userAgent.indexOf("mauie") !== -1 || userAgent.indexOf("symbianos") !== -1 || userAgent.indexOf("opera mobi") !== -1 || userAgent.indexOf("opera mini") !== -1 || userAgent.indexOf("bolt") !== -1 || userAgent.indexOf("safari") !== -1 || userAgent.indexOf("iphone") !== -1 || userAgent.indexOf("android") !== -1 || userAgent.indexOf("windows phone") !== -1 || userAgent.indexOf("iemobile") !== -1) {
        return 'MOBILE';
    }

    return 'DESKTOP';
};

utility.isJson = function (data) {
    try {
        JSON.parse(data);
    } catch (e) {
        return false;
    }

    return true;
};

utility.amountFormat = function (num, float = 2) {
    var n1, n2;
    num = num.replace(",", "");
    num = num + '' || '';
    n1 = num.split('.');
    n2 = n1[1] || null;
    n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");   
    num = (n2 && float > 0)? n1 + '.' + n2 : n1;
    n1 = num.split('.');
    n2 = (n1[1]) || null;
    if (n2 !== null) {
           if (n2.length <= 1) {
                   n2 = n2 + '0';
           } else {
                   n2 = n2.substring(0, float);
           }
    }
    num = (n2 && float > 0) ? n1[0] + '.' + n2 : n1[0];

    return num;
};

utility.percentageFormatter = function (percent = 0) {
    return (utility.isEmpty(percent) === false && percent > 0) ? " @ " + percent + "%" : "";
}

utility.termFormatter = function (term = 0, tag = "") {
    return (utility.isEmpty(term) === false && term > 0) ? " " + term + tag : "";
}

utility.amountFormatter = function(amount = 0) {
    var value = utility.amountFormat(amount,0);

    return (value != 0) ? " " + value : "";
}

utility.encryptStringWithHex = function (plainText, encryptionKey, encryptionIv) {
    let cipher      = crypto.createCipheriv('aes-128-cbc', encryptionKey, encryptionIv);
    let encrypted   = cipher.update(plainText, 'utf8', 'binary');
    encrypted       += cipher.final('binary');
    let hexVal          = new Buffer(encrypted, 'binary');
    return hexVal.toString('hex');
};

utility.decryptStringWithHex = function (encryptedText, encryptionKey, encryptionIv) {
    try{
        let decipher    = crypto.createDecipheriv('aes-128-cbc', encryptionKey, encryptionIv);
        let decrypted   = decipher.update(encryptedText, 'hex', 'binary');
        decrypted += decipher.final('binary');
        return decrypted;
    } catch(ex){
        return null;
    }
    
};

utility.getKeyValue = function (obj, key) {
    if (underscore.has(obj, key) === true) {
        return obj[key];
    }

    return false;
};

utility.validateSignature = function (timeDifference) {
    if (timeDifference <= '2') {
        return true;
    }
    else {
        return false;
    }

};

utility.getInfoFromSignature = function (signature, siteid) {
    return signature.replace(siteid + "_", "");
};

utility.mergeSsoRespAndPayload = (ssoResp,payload) => {
    let ssoTokenDetails = {};
    let detailsConsidered = ['customerId','mobileNo'];
    for(let key of detailsConsidered){
        if(!underscore.isEmpty(ssoResp['user'][key])){
            ssoTokenDetails[key] = ssoResp['user'][key];
        }
    }
    return {...payload,...ssoTokenDetails};
}
module.exports = utility;
