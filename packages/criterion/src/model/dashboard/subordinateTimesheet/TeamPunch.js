Ext.define('criterion.model.dashboard.subordinateTimesheet.TeamPunch', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.DASHBOARD_SUBORDINATE_TIMESHEETS_TEAM_PUNCH
        },

        fields : [
            {
                name : 'employeeId',
                type : 'integer'
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
                name : 'employeeNumber',
                type : 'string'
            },
            {
                name : 'inTime'
            },
            {
                name : 'outTime'
            },
            {
                name : 'skipped',
                type : 'boolean'
            }
        ]
    };

});
