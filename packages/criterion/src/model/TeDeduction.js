Ext.define('criterion.model.TeDeduction', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.teDeduction.Tax'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.TE_DEDUCTION
        },

        fields : [
            {
                name : 'plan',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'codeRegular',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'codeSupplemental',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'maxAmount',
                type : 'float',
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
                model : 'criterion.model.teDeduction.Tax',
                name : 'taxes',
                associationKey : 'taxes'
            }
        ]
    };
});

