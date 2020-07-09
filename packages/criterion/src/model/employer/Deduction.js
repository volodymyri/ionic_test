Ext.define('criterion.model.employer.Deduction', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.Deduction'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_DEDUCTION
        },

        fields : [
            {
                name : 'employerId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
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
                name : 'teDeductionId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'deductionFrequencyId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employeeAmount',
                type : 'string',
                allowNull : true
            },
            {
                name : 'employeeAmountFloat',
                type : 'float',
                allowNull : true,
                persist : false,
                calculate : function(data) {
                    return (data && data.employeeAmount) ? Ext.Number.parseFloat(data.employeeAmount) : null;
                }
            },
            {
                name : 'employerAmount',
                type : 'string',
                allowNull : true
            },
            {
                name : 'employerAmountFloat',
                type : 'float',
                allowNull : true,
                persist : false,
                calculate : function(data) {
                    return (data && data.employerAmount) ? Ext.Number.parseFloat(data.employerAmount) : null;
                }
            },
            {
                name : 'employeeLimit',
                type : 'string',
                allowNull : true
            },
            {
                name : 'employerLimit',
                type : 'string',
                allowNull : true
            },
            {
                name : 'deductionLimitCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DEDUCTION_LIMIT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'deductionCalcMethodCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DEDUCTION_CALC_METHOD,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'deductionCalcMethodCode',
                type : 'criterion_codedatavalue',
                referenceField : 'deductionCalcMethodCd',
                dataProperty : 'code',
                depends : ['deductionCalcMethodCd']
            },
            {
                name : 'payTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.PAY_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'contributionTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.CONTRIBUTION_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'contributionTypeCode',
                type : 'criterion_codedatavalue',
                referenceField : 'contributionTypeCd',
                dataProperty : 'code',
                depends : ['contributionTypeCd']
            },
            {
                name : 'priority',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'isShowEmployee',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isActive',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employerMatch',
                type : 'string'
            },
            {
                name : 'teDeduction'
            },
            {
                name : 'isAutoMakeup',
                type : 'boolean'
            },
            {
                name : 'isUseInOffCycle',
                type : 'boolean'
            },
            {
                name : 'costVisibilityCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COST_VISIBILITY,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isPool',
                type : 'boolean'
            },
            {
                name : 'poolParentDeductionId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'startAfterDeductionId',
                type : 'integer',
                allowNull : true
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.employer.Deduction',
                name : 'pooledParent',
                associationKey : 'pooledParent'
            }
        ]
    };
});
