Ext.define('criterion.model.employee.Goal', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator(),
        WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {

        extend : 'criterion.model.employee.Abstract',

        requires : [
            'criterion.model.WorkflowLog'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GOAL
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'description',
                type : 'string',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'employeeReviewId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'reviewedEmployeeId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'reviewPeriodId',
                type : 'int'
            },
            {
                name : 'reviewId',
                type : 'string'
            },
            {
                name : 'reviewPeriodName',
                type : 'string',
                persist : false
            },
            {
                name : 'reviewPeriodStart',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
            },
            {
                name : 'reviewPeriodEnd',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
            },
            {
                name : 'reviewComments',
                type : 'string'
            },
            {
                name : 'dueDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'completedDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'reviewScaleDetailId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'reviewScaleRating',
                type : 'string',
                persist : false
            },
            {
                name : 'weight',
                type : 'float'
            },
            {
                name : 'weightInPercent',
                persist : false,
                calculate : data => parseInt((data.weight * 100).toFixed(2), 10)
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                allowNull : true,
                persist : false
            },
            {
                name : 'statusCode',
                type : 'criterion_codedatavalue',
                depends : 'statusCd',
                referenceField : 'statusCd',
                persist : false,
                dataProperty : 'code'
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
                name : 'isPendingWorkflow',
                calculate : data => data.statusCode && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED], data.statusCode)
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.WorkflowLog',
                name : 'workflowLog',
                associationKey : 'workflowLog'
            }
        ]

    };
});
