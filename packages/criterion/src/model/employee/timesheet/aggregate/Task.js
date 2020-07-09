Ext.define('criterion.model.employee.timesheet.aggregate.Task', function() {

    return {

        extend : 'criterion.model.employee.timesheet.Task',

        requires : [
            'criterion.model.employee.timesheet.Income',
            'criterion.model.employee.timesheet.TaskDetail'
        ],

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'totalHours',
                type : 'number',
                defaultValue : 0,
                convert : function(value, record) {
                    var timesheet = record.getTimesheet && record.getTimesheet(),
                        timesheetType = timesheet && timesheet.getTimesheetType && timesheet.getTimesheetType(),
                        isFTE = timesheetType && timesheetType.get('isFTE');

                    if (!isFTE) {
                        return value
                    } else {
                        return record.get('fte') * record.get('fteMultiplier')
                    }

                    return value
                },
                depends : ['fte', 'fteMultiplier']
            },
            {
                name : 'fte',
                type : 'number'
            },
            {
                name : 'fteMultiplier',
                type : 'number',
                persist : false
            },
            {
                name : 'paycodeDetail'
            },
            {
                name : 'paycodeChanged',
                type : 'boolean',
                persist : false,
                defaultValue : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.timesheet.TaskDetail',
                name : 'timesheetTaskDetails',
                associationKey : 'timesheetTaskDetails'
            }
        ],

        belongsTo : {
            model : 'criterion.model.employee.timesheet.Aggregate',
            getterName : 'getTimesheet'
        }

    };
});
