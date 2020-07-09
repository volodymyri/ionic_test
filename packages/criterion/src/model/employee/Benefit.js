Ext.define('criterion.model.employee.Benefit', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.Abstract',

        requires : [
            'criterion.model.employer.BenefitPlan',
            'criterion.model.DeductionFrequency'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_BENEFIT
        },

        metaName : 'employee_benefit',

        fields : [
            {
                name : 'benefitPlanId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employeeDeductionId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employeeCoverage',
                type : 'float',
                defaultValue : 0
            },
            {
                name : 'dependentCoverage',
                type : 'float',
                defaultValue : 0
            },
            {
                name : 'premium',
                type : 'float',
                defaultValue : 0
            },
            {
                name : 'employeeContribution',
                type : 'float',
                defaultValue : 0
            },
            {
                name : 'employerContribution',
                type : 'float',
                defaultValue : 0
            },
            {
                name : 'isManualOverride',
                type : 'boolean'
            },
            {
                name : 'planName',
                type : 'string',
                persist : false
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'expirationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'deduction'
            },
            {
                name : 'isCobra',
                type : 'boolean'
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                allowNull : true,
                persist : false
            },
            {
                name : 'status',
                type : 'criterion_codedatavalue',
                depends : 'statusCd',
                referenceField : 'statusCd',
                dataProperty : 'description',
                persist : false
            },
            {
                name : 'statusCode',
                type : 'criterion_codedatavalue',
                depends : 'statusCd',
                referenceField : 'statusCd',
                dataProperty : 'code'
            },

            {
                name : 'workflowLogId',
                type : 'integer',
                allowNull : true,
                persist : false
            },
            {
                name : 'costVisibilityCode',
                type : 'string',
                persist : false
            },
            {
                name : 'deductionCalcMethodCd',
                type : 'integer',
                persist : false
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.employer.BenefitPlan',
                name : 'plan',
                associationKey : 'plan'
            },
            {
                model : 'criterion.model.DeductionFrequency',
                name : 'deductionFrequency',
                associationKey : 'deductionFrequency'
            },
            {
                model : 'criterion.model.employee.Deduction',
                name : 'deduction',
                associationKey : 'deduction'
            },
            {
                model : 'criterion.model.workflow.transaction.Log',
                name : 'workflowLog',
                associationKey : 'workflowLog'
            }
        ],


        hasMany : [
            {
                model : 'criterion.model.employee.benefit.Dependent',
                name : 'dependents',
                associationKey : 'dependents'
            },
            {
                model : 'criterion.model.employee.benefit.Beneficiary',
                name : 'beneficiaries',
                associationKey : 'beneficiaries'
            },
            {
                model : 'criterion.model.employee.benefit.Beneficiary',
                name : 'contingentBeneficiaries',
                associationKey : 'contingentBeneficiaries'
            },
            {
                model : 'criterion.model.employee.benefit.Option',
                name : 'options',
                associationKey : 'options'
            }
        ]
    };
});
