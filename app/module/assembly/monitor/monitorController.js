const constant = require(__basePath + '/app/config/constant');
const response = require(constant.path.app + 'util/response');
const cacheObj = require(constant.path.app + 'core/cache');

exports.ping = function (req, res, next) {
	return res.status(200).json(response.build('SUCCESS', 'PONG'));
}
