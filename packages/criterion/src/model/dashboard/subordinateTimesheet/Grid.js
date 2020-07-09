Ext.define('criterion.model.dashboard.subordinateTimesheet.Grid', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.DASHBOARD_SUBORDINATE_TIMESHEETS_GRID
        },

        fields : [
            {
                name : 'firstName',
                type : 'string'
            },
            {
                name : 'lastName',
                type : 'string'
            },
            {
                name : 'employeeNumber',
                type : 'string'
            },
            {
                name : 'employeeId',
                type : 'integer'
            },
            {
                name : 'totalHours',
                type : 'float'
            },
            {
                name : 'details'
            },
            {
                name : 'timesheets'
            }
        ]
    };

});
