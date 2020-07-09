Ext.define('criterion.model.employer.GLAccountMap', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        fields : [
            {
                name : 'employerId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'glAccountTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.GL_ACCOUNT_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                type : 'criterion_codedatavalue',
                name : 'glAccountTypeCode',
                referenceField : 'glAccountTypeCd',
                dataProperty : 'code',
                depends : 'glAccountTypeCd',
                persist : false
            },
            {
                name : 'incomeListId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'deductionId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'taxId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'taxName',
                type : 'string',
                persist : false
            },
            {
                name : 'timeOffPlanId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'creditGlAccountId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'debitGlAccountId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'employerWorkLocationId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'projectId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'taskId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'departmentCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.DEPARTMENT
            },
            {
                name : 'costCenterCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.COST_CENTER
            },
            {
                name : 'glAccountMapName',
                type : 'string',
                persist : false
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_GL_ACCOUNT_MAP
        }
    };
});
