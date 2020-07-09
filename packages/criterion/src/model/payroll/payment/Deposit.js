Ext.define('criterion.model.payroll.payment.Deposit', function() {

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.payroll.payment.ACHBankAccount'
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.PAYROLL_PAYMENT_DEPOSIT
        },

        fields : [
            {
                name : 'payrollId',
                type : 'integer'
            },
            {
                name : 'employeeId',
                type : 'integer'
            },
            {
                name : 'personName',
                type : 'string'
            },
            {
                name : 'netPay',
                type : 'float'
            },
            {
                name : 'paymentTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.PAYMENT_TYPE
            },
            {
                name : 'paymentTypeCode',
                type : 'criterion_codedatavalue',
                referenceField : 'paymentTypeCd',
                dataProperty : 'code'
            },
            {
                name : 'paymentType',
                type : 'criterion_codedatavalue',
                referenceField : 'paymentTypeCd'
            },
            {
                name : 'paymentReference',
                type : 'string'
            },
            {
                name : 'isPaid',
                type : 'boolean'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.payroll.payment.ACHBankAccount',
                name : 'achBankAccounts',
                associationKey : 'achBankAccounts'
            }
        ]
    };
});
