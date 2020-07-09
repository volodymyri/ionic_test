Ext.define('criterion.model.employer.shift.occurrence.Employee', function() {

    let generateDayDetailsConfig = idx => {
            return {
                model : 'criterion.model.employer.shift.occurrence.employee.DayDetail',
                name : `day${idx}details`,
                associationKey : `day${idx}details`
            }
        };

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.shift.occurrence.employee.DayDetail'
        ],

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'employeeId',
                type : 'int'
            },
            {
                name : 'employeeName',
                type : 'string',
                persist : false
            },
            {
                name : 'overtimeMinutes',
                type : 'int',
                persist : false
            }
        ],

        hasMany : Ext.Array.map(criterion.Utils.range(1, 7), generateDayDetailsConfig)
    };
});
