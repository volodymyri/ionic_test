Ext.define('criterion.model.payroll.payment.ACHBankAccount', function() {

    return {

        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'nameAndNumber',
                type : 'string'
            }
        ]
    };
});
