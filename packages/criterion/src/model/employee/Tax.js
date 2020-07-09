Ext.define('criterion.model.employee.Tax', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        metaName : 'employee_tax',

        fields : [
            {
                name : 'employeeId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'taxNumber',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'geocode',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'schdist',
                type : 'string',
                allowNull : true
            },
            {
                name : 'teFilingStatusId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'priExemption',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'priExemptionAmount',
                type : 'float',
                allowNull : true
            },
            {
                name : 'secExemption',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'secExemptionAmount',
                type : 'float',
                allowNull : true
            },
            {
                name : 'teAlternateCalculationId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'teReciprocityId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'taxExempt',
                type : 'boolean',
                allowNull : true
            },
            {
                name : 'claimAmount',
                type : 'float',
                allowNull : true
            },
            {
                name : 'nonResidentAlien',
                type : 'boolean',
                allowNull : true
            },
            {
                name : 'isNonResidentCertificate',
                type : 'boolean',
                allowNull : true
            },
            {
                name : 'taxTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.TAX_TYPE,
                allowNull : true
            },
            {
                name : 'regTaxCalcMethodCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.TAX_CALC_METHOD,
                allowNull : true
            },
            {
                name : 'supTaxCalcMethodCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.TAX_CALC_METHOD,
                allowNull : true
            },
            {
                name : 'regsupTaxCalcMethodCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.TAX_CALC_METHOD,
                allowNull : true
            },
            {
                name : 'workflowLogId',
                type : 'int',
                persist : false
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                allowNull : true,
                persist : false
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
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true,
                persist : false
            },
            {
                name : 'additionalTax',
                type : 'float',
                allowNull : true
            },
            {
                name : 'annualDeductions',
                type : 'float',
                allowNull : true
            },
            {
                name : 'otherTaxCredits',
                type : 'float',
                allowNull : true
            },
            {
                name : 'designatedAreaDeductions',
                type : 'float',
                allowNull : true
            },
            {
                name : 'taxName',
                type : 'string',
                persist : false
            },
            {
                name : 'fillingStatus',
                type : 'string',
                persist : false
            },
            {
                name : 'filling',
                type : 'string',
                persist : false
            },
            {
                name : 'regTaxCalcMethodDescription',
                type : 'criterion_codedatavalue',
                depends : 'regTaxCalcMethodCd',
                referenceField : 'regTaxCalcMethodCd',
                dataProperty : 'description'
            },
            {
                name : 'supTaxCalcMethodDescription',
                type : 'criterion_codedatavalue',
                depends : 'supTaxCalcMethodCd',
                referenceField : 'supTaxCalcMethodCd',
                dataProperty : 'description'
            },
            {
                name : 'regsupTaxCalcMethodDescription',
                type : 'criterion_codedatavalue',
                depends : 'regsupTaxCalcMethodCd',
                referenceField : 'regsupTaxCalcMethodCd',
                dataProperty : 'description'
            },
            {
                name : 'isOverrideTax',
                type : 'boolean'
            },
            {
                name : 'isMultipleJobs',
                type : 'boolean',
                allowNull : true
            },
            {
                name : 'dependents',
                type : 'float',
                allowNull : true
            },
            {
                name : 'otherIncome',
                type : 'float',
                allowNull : true
            },
            {
                name : 'deductions',
                type : 'float',
                allowNull : true
            },
            {
                name : 'isLastTax',
                type : 'boolean',
                persist : false
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.WorkflowLog',
                name : 'workflowLog',
                associationKey : 'workflowLog'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TAX
        }
    };

});
