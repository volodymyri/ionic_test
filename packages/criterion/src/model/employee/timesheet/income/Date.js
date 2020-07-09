Ext.define('criterion.model.employee.timesheet.income.Date', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            }
        ]
    };
});