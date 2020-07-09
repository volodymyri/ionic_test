Ext.define('criterion.model.employee.Onboarding', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator(),
        FORM_INTERNAL_TYPE = criterion.Consts.FORM_INTERNAL_TYPE;

    return {

        extend : 'criterion.model.employee.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_ONBOARDING
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
                type : 'criterion_codedatavalue',
                name : 'onboardingTaskTypeAttribute2',
                referenceField : 'onboardingTaskTypeCd',
                dataProperty : 'attribute2',
                persist : false
            },
            {
                name : 'hasMarkAsComplete',
                type : 'boolean',
                persist : false,
                calculate : data => data.onboardingTaskTypeAttribute2 === '0'
            },
            {
                name : 'sequence',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'dueDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            },
            {
                name : 'completionDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            },
            {
                name : 'status',
                type : 'string',

                persist : false,
                calculate : data => data.completionDate ? i18n.gettext('Completed') : i18n.gettext('Open')
            },
            {
                name : 'isChangeable',
                type : 'boolean',
                persist : false,
                calculate : data => !data.completionDate
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
                calculate : data => {
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
                name : 'employeeName',
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
                name : 'employeeDocumentId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'notificationSent',
                type : 'boolean'
            },
            {
                name : 'isFillForm',
                type : 'boolean',
                defaultValue : true
            }
        ]
    };
});
