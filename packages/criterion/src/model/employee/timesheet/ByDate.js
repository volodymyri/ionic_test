Ext.define('criterion.model.employee.timesheet.ByDate', function() {

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.timesheet.ByDateDetail'
        ],

        idProperty : 'date',

        fields : [
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'totalHours',
                type : 'string'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.timesheet.ByDateDetail',
                name : 'details',
                associationKey : 'details'
            }
        ]
    };
});
