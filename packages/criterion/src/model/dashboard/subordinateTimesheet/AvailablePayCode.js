Ext.define('criterion.model.dashboard.subordinateTimesheet.AvailablePayCode', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.DASHBOARD_SUBORDINATE_TIMESHEETS_AVAILABLE_PAY_CODES
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'isCompEarned',
                type : 'boolean'
            },
            {
                name : 'isDefault',
                type : 'boolean'
            },
            {
                name : 'isUnits',
                type : 'boolean'
            },
            {
                name : 'paycode',
                type : 'integer'
            }
        ]
    };

});
