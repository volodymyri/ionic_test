Ext.define('criterion.model.teDeduction.Tax', function() {

    var VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'teDeductionId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'taxId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'taxName',
                type : 'string',
                persist : false
            },
            {
                name : 'maxAmount',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
