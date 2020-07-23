const constant   = require(__basePath + '/app/config/constant');
const database   = require(constant.path.app + 'core/database');
const utility    = require(constant.path.app + 'util/utility');
const underscore = require("underscore");

 
class UrlShortnerModel{

    constructor() {
        this.databaseObj = database.getInstance();
    }

    static get DB() {
        return {
            READSLAVE: 'READSLAVE',
            MASTER   : 'MASTER'
        };
    }

    insertUrl(urlShortnerData, callback) {
        let data = {
            url                     : urlShortnerData.url,
            urlShort                : urlShortnerData.urlShort
        };

        let query = `
            INSERT INTO 
            urlShortner (
                    url, 
                    urlShort
                ) 
            VALUES (
                :url, 
                :urlShort
            ) 
        `;

        this.databaseObj.query(
            UrlShortnerModel.DB.MASTER,
            {
                sql   : query,
                values: data
            },
            callback,
            {queryFormat: 'namedParameters'}
        );
    };


    getUrlByShortUrl(urlShort, callback) {

        let query = `
            SELECT
                url
            FROM 
               urlShortner
            WHERE
               urlShort = ?
        `;

        this.databaseObj.query(
            UrlShortnerModel.DB.READSLAVE,
            {
                sql   : query,
                values: [urlShort]
            },
            callback
        );
    };

    getUrlData(url, callback) {

        let query = `
            SELECT
                *
            FROM 
               urlShortner
            WHERE
               url = ?
        `;

        this.databaseObj.query(
            UrlShortnerModel.DB.READSLAVE,
            {
                sql   : query,
                values: [url]
            },
            callback
        );
    };

}

module.exports = UrlShortnerModel;
