Ext.define('criterion.model.dashboard.subordinateTimesheet.MassSubmit', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.DASHBOARD_SUBORDINATE_TIMESHEETS_MASS_SUBMIT
        },

        fields : [
            {
                name : 'timesheetIds',
                type : 'string'
            },
            {
                name : 'firstName',
                type : 'string'
            },
            {
                name : 'lastName',
                type : 'string'
            },
            {
                name : 'isManualDay',
                type : 'boolean'
            },
            {
                name : 'totalHours',
                type : 'float'
            },
            {
                name : 'totalDays',
                type : 'float'
            }
        ]
    };

});
