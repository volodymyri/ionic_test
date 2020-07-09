Ext.define('criterion.model.employer.OpenEnrollment', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator(),
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.openEnrollment.Step',
            'criterion.model.employee.OpenEnrollment'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_OPEN_ENROLLMENT
        },

        fields : [
            {
                name : 'employerId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'endDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employeeOpenEnrollmentStatusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WORKFLOW_STATE,

                mapping : 'employeeOpenEnrollment.statusCd',
                persist : false
            },
            {
                name : 'benefitPlanStartDate',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'cafeBenefitPlanId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'cafeBalanceIncomeListId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'isAutoRollover',
                type : 'boolean'
            }
        ],
        hasMany : [
            {
                model : 'criterion.model.employer.openEnrollment.Step',
                name : 'steps',
                associationKey : 'steps'
            }
        ],
        hasOne : [
            {
                model : 'criterion.model.employee.OpenEnrollment',
                name : 'employeeOpenEnrollment',
                associationKey : 'employeeOpenEnrollment',
                foreignKey : 'openEnrollmentId'
            }
        ]
    };
});
