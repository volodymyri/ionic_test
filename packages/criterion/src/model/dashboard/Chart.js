Ext.define('criterion.model.dashboard.Chart', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.dashboard.AbstractValue',

        fields : [
            {
                name : 'chartType',
                type : 'string'
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'from',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'to',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'limit',
                type : 'integer'
            },
            {
                name : 'employerId',
                type : 'integer'
            }
        ]
    };

});
