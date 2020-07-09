Ext.define('criterion.model.TeIncome', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.teIncome.Tax'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.TE_INCOME
        },

        fields : [
            {
                name : 'compensationType',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'code',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'compTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COMP_TYPE_CD,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isSystem',
                type : 'boolean',
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.teIncome.Tax',
                name : 'taxes',
                associationKey : 'taxes'
            }
        ]
    };
});
