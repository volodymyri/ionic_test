Ext.define('criterion.model.teIncome.Tax', function() {

    var DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'teIncomeId',
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
                name : 'compTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COMP_TYPE_CD,
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
