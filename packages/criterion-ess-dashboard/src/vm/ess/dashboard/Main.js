Ext.define('criterion.vm.ess.dashboard.Main', function() {

    const API = criterion.consts.Api,
        DICT = criterion.consts.Dict,
        WORKFLOW_TYPE_CODE = criterion.Consts.WORKFLOW_TYPE_CODE,
        WORKFLOW_REQUEST_TYPE = criterion.Consts.WORKFLOW_REQUEST_TYPE,
        WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {

        extend : 'Ext.app.ViewModel',

        requires : [
            'criterion.store.employee.TimeOffPlanActive',
            'criterion.store.employer.EssLinks',
            'criterion.store.CustomData',
            'criterion.store.workflowLogs.PendingLogs'
        ],

        alias : 'viewmodel.criterion_ess_dashboard_main',

        data : {
            approverComment : '',
            hidePosting : false,
            hideStream : false,
            hideWorkflow : true,
            hideTasks : true,
            hideRequestType : true,
            workflowLog : null,
            showEssLinks : false,
            hasCustomFields : false
        },

        stores : {
            workflowLogs : {
                type : 'criterion_workflow_log_pending_logs',
                groupField : 'workflowTypeDesc'
            },
            timeOffs : {
                type : 'criterion_employee_time_off_plans_active'
            },
            essLinks : {
                type : 'criterion_employer_ess_links'
            },
            compareChanges : {
                fields : [
                    {
                        name : 'oldData',
                        type : 'string'
                    },
                    {
                        name : 'newData',
                        type : 'string'
                    },
                    {
                        name : 'isSSN',
                        type : 'boolean'
                    },
                    {
                        name : 'item',
                        type : 'string'
                    },
                    {
                        name : 'actual',
                        type : 'string'
                    },
                    {
                        name : 'request',
                        type : 'string'
                    }
                ],
                sorters : [{
                    property : 'newData',
                    direction : 'ASC'
                }]
            },
            removedData : {
                fields : [
                    {
                        name : 'oldData',
                        type : 'string'
                    },
                    {
                        name : 'isSSN',
                        type : 'boolean'
                    },
                    {
                        name : 'item',
                        type : 'string'
                    },
                    {
                        name : 'actual',
                        type : 'string'
                    },
                    {
                        name : 'request',
                        type : 'string'
                    }
                ],
                sorters : [{
                    property : 'oldData',
                    direction : 'ASC'
                }]
            },
            timeoffDetails : {
                fields : [
                    {
                        name : 'timeOffDate',
                        type : 'date',
                        dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT
                    },
                    {
                        name : 'duration'
                    }
                ]
            },
            customData : {
                type : 'criterion_customdata',
                sorters : [{
                    property : 'sequenceNumber',
                    direction : 'ASC'
                }]
            }
        },

        formulas : {
            hideList : data => !!data('workflowLog'),

            isDeleteRequest : data => data('workflowLog.requestType') === WORKFLOW_REQUEST_TYPE.DELETE,
            isCreateRequest : data => data('workflowLog.requestType') === WORKFLOW_REQUEST_TYPE.CREATE,
            isUpdateRequest : data => data('workflowLog.requestType') === WORKFLOW_REQUEST_TYPE.UPDATE,

            hideDescription : data => data('isTimeoff') ||
                data('isFillableForm') ||
                data('isReview') ||
                data('isAssignment') ||
                data('isEEBenefit'),

            hideHead : data => !data('workflowLog') || data('isFillableForm'),

            hideComments : data => !data('workflowLog') || data('isReview'),

            isHorizontalTimesheet : data => data('workflowLog.workflowTypeCode') === WORKFLOW_TYPE_CODE.TIMESHEET &&
                data('workflowLog.actualData.formatCode') === criterion.Consts.TIMESHEET_FORMAT.HORIZONTAL,

            isVerticalTimesheet : data => data('workflowLog.workflowTypeCode') === WORKFLOW_TYPE_CODE.TIMESHEET &&
                data('workflowLog.actualData.formatCode') === criterion.Consts.TIMESHEET_FORMAT.VERTICAL,

            isAggregateTimesheet : data => data('workflowLog.workflowTypeCode') === WORKFLOW_TYPE_CODE.TIMESHEET &&
                data('workflowLog.actualData.formatCode') === criterion.Consts.TIMESHEET_FORMAT.AGGREGATE,

            isTimeoff : data => data('workflowLog.workflowTypeCode') === WORKFLOW_TYPE_CODE.TIME_OFF,

            isEmployeeTax : data => data('workflowLog.workflowTypeCode') === WORKFLOW_TYPE_CODE.EMPLOYEE_TAX,

            isOpenEnrollment : data => data('workflowLog.workflowTypeCode') === WORKFLOW_TYPE_CODE.EMPLOYEE_OPEN_ENROLLMENT,

            isTermination : data => data('workflowLog.workflowTypeCode') === WORKFLOW_TYPE_CODE.EMPLOYEE_TERM,
            isAssignment : data => data('workflowLog.workflowTypeCode') === WORKFLOW_TYPE_CODE.ASSIGNMENT && data('workflowLog.requestType') !== WORKFLOW_REQUEST_TYPE.EMPLOYEE_HIRE,
            isEmployeeHire : data => data('workflowLog.workflowTypeCode') === WORKFLOW_TYPE_CODE.ASSIGNMENT && data('workflowLog.requestType') === WORKFLOW_REQUEST_TYPE.EMPLOYEE_HIRE,

            assignmentDetailTitle : {
                bind : {
                    bindTo : '{workflowLog}',
                    deep : true
                },
                get : function(workflowLog) {
                    let newText = i18n.gettext('New');

                    if (!workflowLog || !workflowLog.actualData) {
                        return newText;
                    }

                    return workflowLog.actualData.assignmentDetailTitle || newText;
                }
            },
            isAssignmentWithTerminate : {
                bind : {
                    bindTo : '{workflowLog}',
                    deep : true
                },
                get : function(workflowLog) {
                    if (!workflowLog) {
                        return;
                    }

                    return workflowLog.requestData ? !!workflowLog.requestData.terminate : false;
                }
            },

            isDependentsContacts : data => data('workflowLog.workflowTypeCode') === WORKFLOW_TYPE_CODE.DEPENDENTS_CONTACTS,

            assignmentActionDescription : {
                bind : {
                    bindTo : '{workflowLog.requestData}',
                    deep : true
                },
                get : function(requestData) {
                    if (!requestData) {
                        return '';
                    }

                    let assignmentActionCd = requestData.assignmentActionCd,
                        assignmentAction = criterion.CodeDataManager.getCodeDetailRecord('id', assignmentActionCd, criterion.consts.Dict.ASSIGNMENT_ACTION);

                    return assignmentAction ? assignmentAction.get('description') : '-';
                }
            },
            effectiveDate : {
                bind : {
                    bindTo : '{workflowLog}',
                    deep : true
                },
                get : function(workflowLog) {
                    return this.get('workflowLog.requestData.effectiveDate');
                }
            },
            terminationDescription : {
                bind : {
                    bindTo : '{workflowLog.requestData}',
                    deep : true
                },
                get : function(requestData) {
                    if (!requestData) {
                        return '';
                    }

                    let terminationCd = requestData.terminationCd,
                        termination = criterion.CodeDataManager.getCodeDetailRecord('id', terminationCd, criterion.consts.Dict.TERMINATION);

                    return termination ? termination.get('description') : '-';
                }
            },
            expirationDate : {
                bind : {
                    bindTo : '{workflowLog}',
                    deep : true
                },
                get : function(workflowLog) {
                    return this.get('workflowLog.requestData.expirationDate');
                }
            },

            isCompareGrid : data => {
                let requestType = data('workflowLog.requestType'),
                    code = data('workflowLog.workflowTypeCode');

                return (requestType === WORKFLOW_REQUEST_TYPE.UPDATE &&
                    Ext.Array.contains(
                        [
                            WORKFLOW_TYPE_CODE.PERSON,
                            WORKFLOW_TYPE_CODE.PERSON_ADDRESS,
                            WORKFLOW_TYPE_CODE.EMPLOYEE_TAX,
                            WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL,
                            WORKFLOW_TYPE_CODE.RELATIONSHIP
                        ],
                        code
                    )) || (requestType !== WORKFLOW_REQUEST_TYPE.DELETE && Ext.Array.contains(
                    [
                        WORKFLOW_TYPE_CODE.DEPENDENTS_CONTACTS,
                        WORKFLOW_TYPE_CODE.PERSON_BANK_ACCOUNT,
                        WORKFLOW_TYPE_CODE.EMPLOYEE_TAX,
                        WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL,
                        WORKFLOW_TYPE_CODE.PERSON_EDUCATION,
                        WORKFLOW_TYPE_CODE.PERSON_SKILL,
                        WORKFLOW_TYPE_CODE.PERSON_CERTIFICATION
                    ],
                    code
                ));
            },

            isRemovedDataGrid : data => {
                let requestType = data('workflowLog.requestType'),
                    code = data('workflowLog.workflowTypeCode');

                return (requestType === WORKFLOW_REQUEST_TYPE.DELETE &&
                    Ext.Array.contains(
                        [
                            WORKFLOW_TYPE_CODE.PERSON_EDUCATION,
                            WORKFLOW_TYPE_CODE.PERSON_SKILL,
                            WORKFLOW_TYPE_CODE.PERSON_CERTIFICATION,
                            WORKFLOW_TYPE_CODE.DEPENDENTS_CONTACTS,
                            WORKFLOW_TYPE_CODE.POSITION
                        ],
                        code
                    ))
            },

            modernAllowCompareGrid : data => {
                let requestType = data('workflowLog.requestType'),
                    code = data('workflowLog.workflowTypeCode');

                return (requestType === WORKFLOW_REQUEST_TYPE.UPDATE && Ext.Array.contains(
                    [
                        WORKFLOW_TYPE_CODE.PERSON,
                        WORKFLOW_TYPE_CODE.PERSON_ADDRESS,
                        WORKFLOW_TYPE_CODE.EMPLOYEE_TAX,
                        WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL,
                        WORKFLOW_TYPE_CODE.RELATIONSHIP,
                        WORKFLOW_TYPE_CODE.POSITION
                    ],
                    code
                )) || (requestType !== WORKFLOW_REQUEST_TYPE.DELETE && Ext.Array.contains(
                    [
                        WORKFLOW_TYPE_CODE.DEPENDENTS_CONTACTS,
                        WORKFLOW_TYPE_CODE.PERSON_BANK_ACCOUNT,
                        WORKFLOW_TYPE_CODE.EMPLOYEE_TAX,
                        WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL,
                        WORKFLOW_TYPE_CODE.PERSON_EDUCATION,
                        WORKFLOW_TYPE_CODE.PERSON_SKILL,
                        WORKFLOW_TYPE_CODE.PERSON_CERTIFICATION
                    ],
                    code
                ));
            },
            containsCustomFields : data => {
                let requestType = data('workflowLog.requestType');

                return requestType !== WORKFLOW_REQUEST_TYPE.DELETE && Ext.Array.contains(
                    [
                        WORKFLOW_TYPE_CODE.DEPENDENTS_CONTACTS
                    ],
                    data('workflowLog.workflowTypeCode')
                );
            },

            isFillableForm : data => Ext.Array.contains([WORKFLOW_TYPE_CODE.FORM, WORKFLOW_TYPE_CODE.EMPLOYEE_ONBOARDING], data('workflowLog.workflowTypeCode')),

            isReview : data => data('workflowLog.workflowTypeCode') === WORKFLOW_TYPE_CODE.EMPLOYEE_REVIEW,

            isPosition : data => data('workflowLog.workflowTypeCode') === WORKFLOW_TYPE_CODE.POSITION,

            isEEBenefit : data => data('workflowLog.workflowTypeCode') === WORKFLOW_TYPE_CODE.EE_BENEFIT,

            canSave : data => (data('isReview') || data('isFillableForm')) && Ext.Array.contains([WORKFLOW_STATUSES.NOT_SUBMITTED, WORKFLOW_STATUSES.REJECTED, WORKFLOW_STATUSES.SAVED], data('workflowLog.statusCode')),

            needApprove : data => {
                let needApprove = true;

                if (data('isFillableForm') || data('isReview')) {
                    needApprove = !Ext.Array.contains([WORKFLOW_STATUSES.NOT_SUBMITTED, WORKFLOW_STATUSES.REJECTED, WORKFLOW_STATUSES.SAVED], data('workflowLog.statusCode'));
                }

                return needApprove;
            },

            canEditForm : data => data('isFillableForm') && Ext.Array.contains([WORKFLOW_STATUSES.NOT_SUBMITTED, WORKFLOW_STATUSES.REJECTED, WORKFLOW_STATUSES.SAVED], data('workflowLog.statusCode')),

            isFillableWebForm : data => data('isFillableForm') && data('workflowLog.actualData.webformId'),

            isFillableDataForm : data => data('isFillableForm') && data('workflowLog.actualData.dataformId'),

            approveText : data => data('needApprove') ? (data('workflowLog.nextStatusCode') === WORKFLOW_STATUSES.VERIFIED ? i18n.gettext('Verify') : i18n.gettext('Approve')) : i18n.gettext('Submit'),

            compareEntity : data => {
                let entity = '';

                switch (data('workflowLog.workflowTypeCode')) {
                    case WORKFLOW_TYPE_CODE.PERSON:
                        entity = i18n.gettext('Information');
                        break;

                    case WORKFLOW_TYPE_CODE.PERSON_ADDRESS:
                        entity = i18n.gettext('Address');
                        break;

                    case WORKFLOW_TYPE_CODE.EMPLOYEE_TAX:
                        entity = i18n.gettext('Filing Status');
                        break;

                    case WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL:
                        entity = i18n.gettext('Goal');
                        break;
                }

                return entity;
            },

            newText : data => Ext.util.Format.format(i18n.gettext('New {0}'), data('compareEntity')),
            oldText : data => Ext.util.Format.format(i18n.gettext('Old {0}'), data('compareEntity')),

            commentsTitle : data => {
                let comments = data('workflowLog.comments'),
                    count = comments && comments.length ? comments.length : 0;

                return '<span class="comment_title">' + i18n.gettext('Comments') + '</span> <span class="comments_count">' + count + '</span>';
            },

            hasComments : data => data('workflowLog.comments.length'),

            timeOffType : data => {
                let timeOffTypeCd = data('workflowLog.actualData.timeOffTypeCd'),
                    codeDataRecord = timeOffTypeCd && criterion.CodeDataManager.getCodeDetailRecord('id', timeOffTypeCd, DICT.TIME_OFF_TYPE);

                return codeDataRecord && codeDataRecord.get('description');
            },

            startTime : data => {
                let date = null,
                    startTime = data('workflowLog.actualData.startTime'),
                    timeOffDate = data('workflowLog.actualData.timeOffDate');

                if (timeOffDate && startTime) {
                    date = Ext.Date.parse(Ext.String.format('{0} {1}', timeOffDate, startTime),
                        Ext.String.format('{0} {1}', API.DATE_FORMAT, API.TIME_FORMAT)
                    );

                    return Ext.Date.format(date, API.DATE_TIME_FORMAT_US);
                } else if (timeOffDate) {
                    date = Ext.Date.parse(timeOffDate, API.DATE_FORMAT);

                    return Ext.Date.format(date, API.DATE_FORMAT_US);
                }
            },

            showRequestType : data => {
                return Ext.Array.contains([
                    WORKFLOW_TYPE_CODE.PERSON,
                    WORKFLOW_TYPE_CODE.PERSON_ADDRESS,
                    WORKFLOW_TYPE_CODE.EMPLOYEE_TAX,
                    WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL,
                    WORKFLOW_TYPE_CODE.PERSON_BANK_ACCOUNT,
                    WORKFLOW_TYPE_CODE.RELATIONSHIP,
                    WORKFLOW_TYPE_CODE.POSITION
                ], data('workflowLog.workflowTypeCode'))
            },

            // Will be used for common types. Bank Account is first one.
            showCommonHeader : data => (
                WORKFLOW_TYPE_CODE.PERSON_BANK_ACCOUNT === data('workflowLog.workflowTypeCode')
                && data('workflowLog.requestType') === WORKFLOW_REQUEST_TYPE.DELETE
            ),

            requestTypeText : data => {
                let requestType = data('workflowLog.requestType'),
                    typeText = '',
                    cls = '';

                switch (requestType) {
                    case WORKFLOW_REQUEST_TYPE.CREATE:
                        typeText = i18n.gettext('Create Requested');
                        break;

                    case WORKFLOW_REQUEST_TYPE.UPDATE:
                        typeText = i18n.gettext('Update Requested');
                        break;

                    case WORKFLOW_REQUEST_TYPE.SUBMIT:
                        typeText = i18n.gettext('Submit Requested');
                        break;

                    case WORKFLOW_REQUEST_TYPE.DELETE:
                        typeText = i18n.gettext('Deletion Requested');
                        break;

                    case WORKFLOW_REQUEST_TYPE.CANCEL:
                        typeText = i18n.gettext('Cancel Requested');
                        cls = 'criterion-red';
                        break;

                    case WORKFLOW_REQUEST_TYPE.RECALL:
                        typeText = i18n.gettext('Recall Requested');
                        break;
                }

                return Ext.util.Format.format('<strong class="{1}">{0}</strong>', typeText, cls);
            },

            requestActionTypeText : data => {
                let requestType = data('workflowLog.requestType'),
                    typeText = '';

                switch (requestType) {
                    case WORKFLOW_REQUEST_TYPE.CREATE:
                        typeText = i18n.gettext('New');
                        break;

                    case WORKFLOW_REQUEST_TYPE.UPDATE:
                        typeText = i18n.gettext('Change');
                        break;

                    case WORKFLOW_REQUEST_TYPE.SUBMIT:
                        typeText = i18n.gettext('Submit');
                        break;

                    case WORKFLOW_REQUEST_TYPE.DELETE:
                        typeText = i18n.gettext('Delete');
                        break;
                }

                return typeText;
            },

            units : data => data('workflowLog.actualData.isAccrualInDays') ? i18n.gettext('days') : i18n.gettext('hours')

        }
    }
});
