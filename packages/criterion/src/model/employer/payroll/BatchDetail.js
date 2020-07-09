Ext.define('criterion.model.employer.payroll.BatchDetail', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        requires: [
            'criterion.model.employer.payroll.PayrollEntry',
            'criterion.model.employer.payroll.BatchIncome'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_BATCH_DETAIL
        },

        hasMany : [
            {
                model : 'criterion.model.employer.payroll.PayrollEntry',
                name : 'payrolls',
                associationKey : 'payrolls'
            },
            {
                model : 'criterion.model.employer.payroll.BatchIncome',
                name : 'batchIncomes',
                associationKey : 'batchIncomes'
            }
        ]
    };
});
