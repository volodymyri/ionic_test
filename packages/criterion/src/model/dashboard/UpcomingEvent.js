Ext.define('criterion.model.dashboard.UpcomingEvent', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'companyEventId',
                type : 'integer'
            },
            {
                name : 'companyEventName',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            }
        ],

        proxy : {
            type : 'memory'
        }
    };
});