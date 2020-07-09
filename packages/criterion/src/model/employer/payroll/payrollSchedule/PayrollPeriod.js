Ext.define('criterion.model.employer.payroll.payrollSchedule.PayrollPeriod', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_SCHEDULE_PAYROLL_PERIOD
        },

        fields : [
            {
                name : 'number',
                allowNull : true,
                type : 'int'
            },
            {
                name : 'periodStartDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'periodEndDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'payDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'year',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'payrollScheduleId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isForShow',
                type : 'boolean',
                persist : false,
                defaultValue : false
            }
        ]
    };
});
