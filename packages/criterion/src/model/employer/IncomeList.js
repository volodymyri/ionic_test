Ext.define('criterion.model.employer.IncomeList', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_INCOME_LIST
        },

        fields : [
            {
                name : 'code',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isActive',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isOvertimeEligible',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'incomeCalcMethodCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.INCOME_CALC_METHOD,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'incomeCalcMethodCode',
                type : 'criterion_codedatavalue',
                referenceField : 'incomeCalcMethodCd',
                dataProperty : 'code'
            },
            {
                name : 'teIncomeId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'payTypeCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.PAY_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'rate',
                type : 'float',
                allowNull : true
            },
            {
                name : 'multiplier',
                allowNull : true
            },
            {
                name : 'periodCeiling',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'monthlyCeiling',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'annualCeiling',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'lifetimeCeiling',
                type : 'float',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'exclusionType',
                type : 'int'
            },
            {
                name : 'priority',
                type : 'integer',
                defaultValue : 1
            },
            {
                name : 'first',
                type : 'boolean'
            },
            {
                name : 'second',
                type : 'boolean'
            },
            {
                name : 'third',
                type : 'boolean'
            },
            {
                name : 'fourth',
                type : 'boolean'
            },
            {
                name : 'fifth',
                type : 'boolean'
            },
            {
                name : 'last',
                type : 'boolean'
            }
        ]
    };
});
