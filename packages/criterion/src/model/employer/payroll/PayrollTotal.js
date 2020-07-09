Ext.define('criterion.model.employer.payroll.PayrollTotal', function() {

    return {

        extend : 'Ext.data.Model',

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'amount',
                type : 'float'
            },
            {
                name : 'ytd',
                type : 'float'
            }
        ]
    };
})
;