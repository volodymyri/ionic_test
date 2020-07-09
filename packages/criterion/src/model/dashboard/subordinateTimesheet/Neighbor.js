Ext.define('criterion.model.dashboard.subordinateTimesheet.Neighbor', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DASHBOARD_SUBORDINATE_TIMESHEETS_NEIGHBORS
        },

        idProperty : 'timesheetId',

        fields : [
            {
                name : 'timesheetId',
                type : 'integer'
            },
            {
                name : 'startDate',
                type : 'date'
            },
            {
                name : 'endDate',
                type : 'date'
            },
            {
                name : 'personName',
                type : 'string'
            },
            {
                name : 'assignmentTitle',
                type : 'string'
            },
            {
                name : 'displayedValue',
                calculate : data => `${data.personName} (${data.assignmentTitle})`
            }
        ]
    };

});
