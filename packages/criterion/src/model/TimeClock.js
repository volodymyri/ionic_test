Ext.define('criterion.model.TimeClock', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.TIME_CLOCK
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isActive',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'code',
                type : 'string'
            },
            {
                name : 'message',
                type : 'string'
            },
            {
                name : 'authenticationToken',
                type : 'string'
            },
            {
                name : 'lastSyncTime',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'color',
                type : 'string',
                defaultValue : '#1e8bf2'
            },
            {
                name : 'deviceSerialNumber',
                type : 'string'
            }
                        
        ]
    };
});
