Ext.define('criterion.model.employer.onboarding.Detail', function() {

    const VALIDATOR = criterion.Consts.getValidator(),
        FORM_INTERNAL_TYPE = criterion.Consts.FORM_INTERNAL_TYPE;

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'onboardingGroupCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.ONBOARDING_GROUP,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'onboardingTaskTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.ONBOARDING_TASK_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                type : 'criterion_codedatavalue',
                name : 'onboardingTaskTypeCode',
                referenceField : 'onboardingTaskTypeCd',
                dataProperty : 'code',
                depends : 'onboardingTaskTypeCd',
                persist : false
            },
            {
                name : 'sequence',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'dueInDays',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'isChangeable',
                type : 'boolean',
                persist : false,
                defaultValue : true
            },
            {
                name : 'webformId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'dataformId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'formId',
                type : 'string',
                persist : false,
                calculate : function(data) {
                    let webformId = data.webformId,
                        dataformId = data.dataformId;

                    return webformId ? Ext.String.format('{0}-{1}', FORM_INTERNAL_TYPE.WEB, webformId) : Ext.String.format('{0}-{1}', FORM_INTERNAL_TYPE.DATA, dataformId);
                }
            },
            {
                name : 'workflowId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'workflowName',
                type : 'string',
                persist : false
            },
            {
                name : 'employerDocumentId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'employerDocumentName',
                type : 'string',
                persist : false
            },
            {
                name : 'employerVideoId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'employerVideoUrl',
                type : 'string',
                persist : false
            },
            {
                name : 'taskDescription',
                type : 'string'
            },
            {
                name : 'assignedToEmployeeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'assignedToEmployeeName',
                type : 'string',
                persist : false
            },
            {
                name : 'courseId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'courseName',
                type : 'string',
                persist : false
            },
            {
                name : 'isShare',
                type : 'boolean'
            }
        ]
    };
});
