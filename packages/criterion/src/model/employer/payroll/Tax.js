Ext.define('criterion.model.employer.payroll.Tax', function() {

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
                name : 'overriddenAmount',
                type : 'float',
                allowNull : true
            },
            {
                name : 'ytd',
                type : 'float'
            },
            {
                name : 'taxId',
                type : 'int'
            },
            {
                name : 'canEdit',
                type : 'boolean'
            }
        ]

    };

});
