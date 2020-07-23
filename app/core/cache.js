const constant      = require(__basePath + 'app/config/constant');
const redis         = require('redis');
const config        = require(constant.path.app + 'core/configuration');
const exception     = require(constant.path.app + 'core/exception');
const {logger}      = require(constant.path.app + 'core/logger');
const underscore    = require('underscore');
const promise       = require('bluebird');
const genericPool   = require("generic-pool");


class Cache {

    constructor() {
        this.connectionDetails  = config.get('cache:redis');
        this.pool               = null;
        this._createPoolConnection();
    }

    errorHandling (pool, client, error) {
        if (underscore.contains(['NR_CLOSED', 'CONNECTION_BROKEN'], error.code)) {
            pool.destroy(client);
        }

        return new exception.CacheConnectionException();
    }

    checkConnection(callback){

        if (true !== config.get('cache:redis:switch')) {
            return callback(null, 'Cache switch is off');
        }

        const client = this._getClient(this.connectionDetails);
        client.ping(function (error, result) {
            client.quit();
            if (result != "PONG") {
                this._createClientPool(0);
                return callback('error'); 
            }
            
            return callback(null, result);
        }.bind(this));
    }
    
    createFactory (connectionDetails) {
        let _this   = this;
        return {
            create: () => {
                return _this._getClient(connectionDetails);
            },
            destroy: (client) => {
                client.quit();
            }
        };
    }

    _createPoolConnection() {
       
        this.pool = {
            MASTER   : genericPool.createPool(
                this.createFactory(this.connectionDetails),
                {
                    max: this.connectionDetails.maxConnections || 10,
                    min: this.connectionDetails.minConnections || 0
                }
            ),
        };
    };

    _getClient(configuration) {
       
        // Variable is defined to add aditional client configuration 
        configuration.retry_strategy = function (options) {
            if (options.error && options.error.code === 'ECONNREFUSED') {
                logger.error('Redis Connection Error' + JSON.stringify(options.error));
                return new exception.CacheConnectionException();

                if (options.attempt > 10) {
                    return undefined;
                }
            }
            return Math.min(options.attempt * 10000, 20000);
        };

        return redis.createClient(configuration);
    };
    
    prepareKey  (keyArray) {
        return keyArray.join(':');
    }

    set(key, data, options = [],callback = function () {}) {
        let _this = this;

        let pool    = this.pool.MASTER;

        // return new promise((resolve, reject) => {
            return pool.acquire()
                .then((client) => {
                    if (options.ttl) {
                        return client.setex(key, options.ttl, data, (error, result) => {
                            if (error) { return callback(_this.errorHandling(pool, client, error)); }

                            pool.release(client);
                            return callback(null,result);
                        });
                    }

                    return client.set(key, data, (error, result) => {
                        if (error) { return callback(_this.errorHandling(pool, client, error)); }

                        pool.release(client);
                        return callback(null, result);
                    });
                })
                .catch((error => {
                    return callback(error);
                })) ;
        // });
    }

    //Get key data
    get(key, callback = function () {}) {

        let _this   = this;
        let pool    = this.pool.MASTER;

       // return new promise((resolve, reject) => {
            pool.acquire()
                .then((client) => {
                    return client.get(key, (error, data) => {
                        if (error) { return callback(_this.errorHandling(pool, client, error)); }

                        pool.release(client);
                        return callback(null, data);
                    });
                })
                .catch((error => {
                    return callback(error);
                }));
       // });
    }
    
    //Get key data
    delete(key,callback = function () {}) {
        let _this = this;

        let pool    = this.pool.MASTER;
        //return new promise((resolve, reject) => {
            pool.acquire()
                .then((client) => {
                    return client.del(key, (error, result) => {
                        if (error) { return callback(_this.errorHandling(pool, client, error)); }

                        pool.release(client);
                        return callback(null, result === 1);
                    });
                })
                .catch((error => {
                    return callback(error);
                }));
        //});
    }

    increment(key, callback = function () {}) {
        let _this = this;

        let pool    = this.pool.MASTER;
        //return new promise((resolve, reject) => {
            pool.acquire()
                .then((client) => {
                    return client.incr(key, (error, result) => {
                        if (error) { return callback(_this.errorHandling(pool, client, error)); }

                        pool.release(client);
                        return callback(null, result === 1);
                    });
                })
                .catch((error => {
                    return callback(error);
                }));
        //});
    }

    hset(hashKey, key, data, options = {}) {
        let _this = this;
        let pool    = this.pool.MASTER;

        return new promise((resolve, reject) => {
            pool.acquire()
                .then((client) => {

                    if (options.ttl) {
                        
                        return client.hset(hashKey, key, data, 'EX', options.ttl, (error, result) => {
                            if (error) { return reject(_this.errorHandling(pool, client, error)); }

                            pool.release(client);
                            return resolve(result);
                        });
                    }

                    return client.hset(hashKey, key, data, (error, result) => {
                        if (error) { return reject(_this.errorHandling(pool, client, error)); }

                        pool.release(client);
                        return resolve(result);
                    });
                })
                .catch(reject);
        });
    }
    
    hget(hashKey, key) {        
        let _this   = this;
        let pool    = this.pool.MASTER;

        return new promise((resolve, reject) => {
            pool.acquire()
                .then((client) => {
                    return client.hget(hashKey, key, (error, result) => {
                        if (error) { return reject(_this.errorHandling(pool, client, error)); }

                        pool.release(client);
                        return resolve(result);
                    });                    
                })
                .catch(reject);
        });
    }

}

module.exports = (new Cache);