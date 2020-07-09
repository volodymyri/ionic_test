Ext.define('criterion.model.workflowLog.PendingLog', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        WORKFLOW_TYPE_CODE = criterion.Consts.WORKFLOW_TYPE_CODE,
        WORKFLOW_REQUEST_TYPE = criterion.Consts.WORKFLOW_REQUEST_TYPE;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.workflowLog.Comment',
            'criterion.model.employee.Onboarding'
        ],

        disableCaching : true,

        proxy : {
            type : 'criterion_rest',
            url : API.WORKFLOW_TRANSACTION_LOG_PENDING_APPROVAL
        },

        fields : [
            {
                name : 'actionTime',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'employeeName',
                type : 'string'
            },
            {
                name : 'employeeTimezoneCd',
                type : 'criterion_codedata',
                codeDataId : DICT.TIME_ZONE
            },
            {
                name : 'employeeTimezoneCode',
                type : 'criterion_codedatavalue',
                referenceField : 'employeeTimezoneCd',
                dataProperty : 'code',
                depends : ['employeeTimezoneCd']
            },
            {
                name : 'workflowTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW
            },
            {
                name : 'workflowTypeCode',
                type : 'string'
            },
            {
                name : 'workflowTypeDescription',
                type : 'string'
            },
            {
                name : 'workflowTypeDesc',
                type : 'string',
                persist : false,
                depends : ['workflowTypeCode', 'requestType'],
                calculate : function(data) {
                    return data['workflowTypeCode'] === WORKFLOW_TYPE_CODE.ASSIGNMENT && data['requestType'] === WORKFLOW_REQUEST_TYPE.EMPLOYEE_HIRE ? i18n.gettext('Employee Hire') : data['workflowTypeDescription'];
                }
            },
            {
                name : 'statusCode',
                type : 'string'
            },
            {
                name : 'requestData'
            },
            {
                name : 'actualData'
            },
            {
                name : 'requestType',
                type : 'string'
            },
            {
                name : 'commentsCount',
                persist : false,
                calculate : function(data) {
                    return data['comments'] ? data['comments'].length : 0
                }
            },
            {
                name : 'comments'
            },
            {
                name : 'workflowQueueId',
                type : 'int'
            },
            {
                name : 'isRejected',
                persist : false,
                depends : ['statusCode'],
                calculate : function(data) {
                    return data['statusCode'] === criterion.Consts.WORKFLOW_STATUSES.REJECTED
                }
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'isOnboarding',
                type : 'boolean',
                persist : false
            },
            {
                name : 'dueDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
            },
            {
                name : 'delegatedByEmployeeId',
                type : 'integer',
                allowNull : true
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.employee.Onboarding',
                name : 'employeeOnboarding',
                associationKey : 'employeeOnboarding'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.workflowLog.Comment',
                name : 'comments',
                associationKey : 'comments'
            }
        ]
    };
});
