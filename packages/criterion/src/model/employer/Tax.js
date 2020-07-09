Ext.define('criterion.model.employer.Tax', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_TAX
        },

        fields : [
            {
                name : 'employerId',
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
                name : 'taxIdentifier',
                type : 'string',
                allowNull : true
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'rate',
                type : 'float',
                allowNull : true
            },
            {
                name : 'taxCalcMethodCd',
                type : 'criterion_codedata',
                codeDataId : DICT.TAX_CALC_METHOD,
                allowNull : true
            },
            {
                name : 'isRecalc',
                type : 'boolean'
            },
            {
                name : 'isRounding',
                type : 'boolean'
            },
            {
                name : 'isOverrideTax',
                type : 'boolean'
            },
            {
                name : 'wageBase',
                type : 'float',
                allowNull : true
            }
        ]
    };
});

