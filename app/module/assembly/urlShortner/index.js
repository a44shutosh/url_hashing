const constant = require(__basePath + 'app/config/constant');
const router   = require('express').Router({
    caseSensitive: true,
    strict       : true
});
const urlShortnerController  = require(constant.path.module + 'assembly/urlShortner/urlShortnerAssembly');
const validation    = require(constant.path.module + 'assembly/urlShortner/urlShortnerValidation');

router.post(
    '/createUrl',
    validation.createShortUrl,
    urlShortnerController.createShortUrl
);

router.get(
    '/getPrimaryUrl',
    urlShortnerController.getPrimaryUrl
);


module.exports = {
    router: router
};
