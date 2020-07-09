Ext.define('criterion.model.dashboard.subordinateTimesheet.GridDetail', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'sorter',
                type : 'integer',
                persist : false
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
                name : 'fullName',
                persist : false,
                calculate : function(data) {
                    return data.sorter === 0 ? data.lastName + ' ' + data.firstName + ' (' + data.employeeNumber + ')' : '\u00A0 \u21B3';
                }
            },
            {
                name : 'employeeId',
                type : 'integer'
            },
            {
                name : 'totalHours',
                type : 'float',
                allowNull : true
            },
            {
                name : 'totalDays',
                type : 'float',
                allowNull : true
            },

            {
                name : 'assignmentId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'workLocationId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'workLocationAreaId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'projectId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'taskId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'customValue1',
                type : 'string'
            },
            {
                name : 'customValue2',
                type : 'string'
            },
            {
                name : 'customValue3',
                type : 'string'
            },
            {
                name : 'customValue4',
                type : 'string'
            },

            {
                name : 'dateHours'
            },
            {
                name : 'dateStatuses'
            },
            {
                name : 'projects'
            },
            {
                name : 'tasks'
            },
            {
                name : 'assignments'
            },
            {
                name : 'workLocations'
            },
            {
                name : 'workLocationAreas'
            }
        ]
    };

});
