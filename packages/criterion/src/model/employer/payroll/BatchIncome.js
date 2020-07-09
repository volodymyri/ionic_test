Ext.define('criterion.model.employer.payroll.BatchIncome', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_BATCH_SUMMARY
        },

        fields : [
            {
                name : 'method'
            },
            {
                name : 'name'
            }
        ]
    };
});