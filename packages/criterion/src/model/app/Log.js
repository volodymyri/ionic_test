Ext.define('criterion.model.app.Log', function() {

    var Api = criterion.consts.Api;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : Api.API.APP_LOG
        },

        fields : [
            {
                name : 'dateTime',
                type : 'date',
                dateFormat : Api.RAW_DATE_TIME_FORMAT
            },
            {
                name : 'type',
                type : 'string'
            },
            {
                name : 'action',
                type : 'string'
            },
            {
                name : 'statusMessage',
                type : 'string'
            }
        ]
    };
});
