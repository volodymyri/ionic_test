Ext.define('criterion.store.employer.payroll.Schedules', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_payroll_schedules',

        model : 'criterion.model.employer.payroll.Schedule',
        autoLoad : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_SCHEDULE
        }
    };
});
