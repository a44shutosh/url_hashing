const constant   = require(__basePath + '/app/config/constant');
const database   = require(constant.path.app + 'core/database');
const utility    = require(constant.path.app + 'util/utility');
const underscore = require("underscore");

class CallbackRequestModel {

    constructor() {
        this.databaseObj = database.getInstance();
    }

    static get DB() {
        return {
            READSLAVE: 'READSLAVE',
            MASTER   : 'MASTER'
        };
    }

    setCallbackInfo(leadId, callback) {
        let leadData = {
            callbackRequestId   : utility.uuid(),
            leadId              : leadId            
        };

        let query = `
            INSERT INTO 
                callbackRequest (
                    callbackRequestId,
                    leadId                    
                ) 
            VALUES (
                :callbackRequestId,
                :leadId
            ) 
        `;

        this.databaseObj.query(
            CallbackRequestModel.DB.MASTER,
            {
                sql   : query,
                values: leadData
            },
            callback,
            {queryFormat: 'namedParameters'}
        );
    };

    updateCallbackInfo(leadId, callback) {
        let leadData = {
            leadId  : leadId,
            currentData : new Date()
        };

        let query = `
            UPDATE 
                callbackRequest 
            SET 
                leadId = :leadId,
                updatedAt = :currentData
            WHERE (
                leadId = :leadId
            ) 
        `;

        this.databaseObj.query(
            CallbackRequestModel.DB.MASTER,
            {
                sql   : query,
                values: leadData
            },
            callback,
            {queryFormat: 'namedParameters'}
        );
    };


    getCallbackInfo(leadId, callback) {

        let query = `
            SELECT
                *
            FROM 
                callbackRequest
            WHERE
                leadId = ?
        `;

        this.databaseObj.query(
            CallbackRequestModel.DB.READSLAVE,
            {
                sql   : query,
                values: [leadId]
            },
            callback
        );
    };

}

module.exports = CallbackRequestModel;
