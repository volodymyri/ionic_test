Ext.define('criterion.model.employee.Deduction', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.deduction.EmployeeGarnishment'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_DEDUCTION
        },

        fields : [
            {
                name : 'employeeId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'deductionId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY],
                allowNull : true // true when created as benefit's child
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'expirationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'employeeLimit',
                type : 'string'
            },
            {
                name : 'employerLimit',
                type : 'string'
            },
            {
                name : 'deductionLimitCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DEDUCTION_LIMIT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'deductionLimitDescription',
                type : 'criterion_codedatavalue',
                referenceField : 'deductionLimitCd',
                dataProperty : 'description',
                depends : ['deductionLimitCd']
            },
            {
                name : 'deduction'
            },
            {
                name : 'employerMatch',
                type : 'string'
            },
            {
                name : 'deductionCalcMethodCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DEDUCTION_CALC_METHOD
            },
            {
                name : 'deductionCalcMethodCode',
                type : 'criterion_codedatavalue',
                referenceField : 'deductionCalcMethodCd',
                dataProperty : 'code',
                depends : ['deductionCalcMethodCd']
            },
            {
                name : 'contributionTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.CONTRIBUTION_TYPE,
                persist : false
            },
            {
                name : 'contributionTypeCode',
                type : 'criterion_codedatavalue',
                referenceField : 'contributionTypeCd',
                dataProperty : 'code',
                depends : ['contributionTypeCd']
            },
            {
                name : 'qualifyingEventCd',
                type : 'criterion_codedata',
                codeDataId : DICT.QUALIFYING_EVENT
            },
            {
                name : 'frequency'
            },
            {
                name : 'deductionFrequency',
                type : 'string',
                persist : false,
                calculate : data => data.frequency ? data.frequency.description : ''
            },
            {
                name : 'arrearAmount',
                type : 'float'
            },
            {
                name : 'costVisibilityCode',
                type : 'string',
                persist : false
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
                calculate : data => (data && data.employeeAmount) ? Ext.Number.parseFloat(data.employeeAmount) : null
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
                calculate : data => (data && data.employerAmount) ? Ext.Number.parseFloat(data.employerAmount) : null
            },
            {
                name : 'accountNumber',
                type : 'string',
                allowNull : true
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.employee.deduction.EmployeeGarnishment',
                name : 'employeeGarnishment',
                associatedName : 'employeeGarnishment',
                foreignKey : 'employeeDeductionId'
            }
        ]
    };
});
