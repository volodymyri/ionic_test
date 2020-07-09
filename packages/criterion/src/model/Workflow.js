Ext.define('criterion.model.Workflow', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.WORKFLOW
        },

        fields : [
            {
                name : 'employerId',
                type : 'int'
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'workflowTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'workflowTypeCode',
                type : 'criterion_codedatavalue',
                referenceField : 'workflowTypeCd',
                dataProperty : 'code'
            },
            {
                name : 'workflowTypeDescription',
                type : 'criterion_codedatavalue',
                referenceField : 'workflowTypeCd',
                dataProperty : 'description'
            },
            {
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'confirmText',
                type : 'string'
            },
            {
                name : 'isSignature',
                type : 'boolean'
            },
            {
                name : 'isMultipleApprove',
                type : 'boolean'
            },
            {
                name : 'isEmailApproval',
                type : 'boolean'
            },
            {
                name : 'escalationDays',
                type : 'integer',
                validators : [VALIDATOR.POSITIVE_ONLY],
                allowNull : true
            },
            {
                name : 'autoActionDays',
                type : 'integer',
                validators : [VALIDATOR.POSITIVE_OR_ZERO],
                allowNull : true
            },
            {
                name : 'autoActionType',
                type : 'string',
                allowNull : true
            },
            {
                name : 'employeeGroups',
                persist : false
            }
        ]
    };
});
