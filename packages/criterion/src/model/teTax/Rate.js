Ext.define('criterion.model.teTax.Rate', function() {

    const VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'teTaxId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'startAmount',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'endAmount',
                type : 'float',
                allowNull : true
            },
            {
                name : 'rate',
                type : 'float',
                allowNull : true
            },
            {
                name : 'amount',
                type : 'float',
                allowNull : true
            }
        ]
    };
});
