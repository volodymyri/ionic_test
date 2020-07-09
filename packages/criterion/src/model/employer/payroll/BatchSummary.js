Ext.define('criterion.model.employer.payroll.BatchSummary', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_BATCH_SUMMARY
        },

        fields : [
            {
                name : 'numberOfEmployees',
                type : 'int'
            },
            {
                name : 'totalIncome',
                type : 'float'
            },
            {
                name : 'totalEmployerDeductions',
                type : 'float'
            },
            {
                name : 'totalEmployeeDeductions',
                type : 'float'
            },
            {
                name : 'totalEmployerTax',
                type : 'float'
            },
            {
                name : 'totalEmployeeTax',
                type : 'float'
            },
            {
                name : 'regularIncome',
                type : 'float'
            },
            {
                name : 'otherIncome1',
                type : 'float'
            },
            {
                name : 'otherIncome2',
                type : 'float'
            },
            {
                name : 'totalDeductions',
                type : 'float'
            },
            {
                name : 'net',
                type : 'float'
            }
        ]
    };
});