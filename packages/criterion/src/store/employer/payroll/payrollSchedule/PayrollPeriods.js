Ext.define('criterion.store.employer.payroll.payrollSchedule.PayrollPeriods', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_payroll_payroll_schedule_payroll_periods',

        model : 'criterion.model.employer.payroll.payrollSchedule.PayrollPeriod',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_SCHEDULE_PAYROLL_PERIOD
        }
    };
});
