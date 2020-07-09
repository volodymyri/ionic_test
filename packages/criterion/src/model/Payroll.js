Ext.define('criterion.model.Payroll', function() {

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.PAYROLL
        },

        fields : [
            {
                name : 'employeeId',
                type : 'int'
            },
            {
                name : 'batchId',
                type : 'int'
            },
            {
                name : 'payrollPeriodId',
                type : 'int'
            },
            {
                name : 'payDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
            },
            {
                name : 'nonCashTotal',
                type : 'float'
            },
            {
                name : 'grossIncomeTotal',
                type : 'float'
            },
            {
                name : 'reimbursementIncomeTotal',
                type : 'float'
            },
            {
                name : 'employeeDeductionTotal',
                type : 'float'
            },
            {
                name : 'employeeTaxTotal',
                type : 'float'
            },
            {
                name : 'netPay',
                type : 'float'
            },
            {
                name : 'employerDeductionTotal',
                type : 'float'
            },
            {
                name : 'employerTaxTotal',
                type : 'float'
            },
            {
                name : 'supplementalMethod',
                type : 'int'
            },
            {
                name : 'residentGeocode',
                type : 'int'
            },
            {
                name : 'primaryWorkGeocode',
                type : 'int'
            },
            {
                name : 'residentSchoolDistrict',
                type : 'int'
            },
            {
                name : 'canEdit',
                type : 'boolean'
            },
            {
                name : 'isCalculated',
                type : 'boolean',
                persist : false
            },
            {
                name : 'employerBankAccountId',
                type : 'int'
            },
            {
                name : 'isPaid',
                type : 'boolean'
            },
            {
                name : 'personName',
                type : 'string',
                persist : false
            },
            {
                name : 'payrollNotes',
                type : 'string'
            }
        ]
    };
});
