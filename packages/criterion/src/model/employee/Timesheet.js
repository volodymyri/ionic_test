Ext.define('criterion.model.employee.Timesheet', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.Abstract',

        requires : [
            'criterion.model.employee.timesheet.Task',
            'criterion.model.CustomData',
            'criterion.model.TimesheetType',
            'criterion.model.employee.timesheet.Total',
            'criterion.model.employee.timesheet.AutoPopulate'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIMESHEET
        },

        fields : [
            {
                name : 'employeeId',
                type : 'int',
                persist : false
            },
            {
                name : 'personName',
                type : 'string',
                persist : false
            },
            {
                name : 'assignmentTitle',
                type : 'string',
                persist : false,
                convert : function(value) {
                    return value || i18n.gettext('No Assignment')
                },
                allowNull : true
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
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WORKFLOW_STATE,
                allowNull : true
            },
            {
                name : 'timesheetStatusCode',
                persist : false,
                type : 'string'
            },
            {
                name : 'timesheetStatusDescription',
                type : 'criterion_codedatavalue',
                referenceField : 'statusCd',
                dataProperty : 'description',
                depends : 'statusCd'
            },
            {
                name : 'totalHours',
                persist : false,
                type : 'string'
            },
            {
                name : 'totalHoursVal',
                persist : false,
                type : 'string'
            },
            {
                name : 'formattedTotalHours',
                persist : false,
                type : 'string'
            },
            {
                name : 'totalDays',
                persist : false,
                type : 'float'
            },
            {
                name : 'isManualDay',
                persist : false,
                type : 'boolean'
            },
            {
                name : 'workflowLogId',
                allowNull : true,
                type : 'integer'
            },
            {
                name : 'isCurrent',
                persist : false,
                type : 'boolean'
            },
            {
                name : 'isVertical',
                persist : false,
                type : 'boolean'
            },
            {
                name : 'hasOneAssignment',
                type : 'boolean',
                persist : false
            },
            {
                name : 'hasOneEmployeeWorkLocation',
                type : 'boolean',
                persist : false
            },
            {
                type : 'criterion_timezone',
                name : 'timezoneCd'
            },
            {
                type : 'criterion_codedatavalue',
                name : 'timezoneDesc',
                referenceField : 'timezoneCd'
            },
            {
                name : 'formatCode',
                type : 'string',
                persist : false
            },
            {
                name : 'notSubmittedOrRejected',
                type : 'boolean',
                persist : false,
                depends : 'timesheetStatusCode',
                calculate : function(timesheet) {
                    if (!timesheet) {
                        return false
                    }

                    let WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

                    return Ext.Array.contains([
                        WORKFLOW_STATUSES.NOT_SUBMITTED, WORKFLOW_STATUSES.REJECTED
                    ], timesheet.timesheetStatusCode)
                }
            },
            {
                name : 'canBeEdited',
                type : 'boolean',
                persist : false,
                depends : 'timesheetStatusCode',
                calculate : function(timesheet) {
                    if (!timesheet) {
                        return false
                    }

                    let timesheetType = timesheet && Ext.isFunction(timesheet['getTimesheetType']) && timesheet.getTimesheetType(),
                        disableManual = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON);

                    if(disableManual){
                        return false
                    }

                    return timesheet.notSubmittedOrRejected
                }
            },
            {
                name : 'entryType',
                type : 'integer',
                persist : false
            },
            {
                name : 'notes',
                type : 'string',
                allowNull : true,
                persist : false
            },
            {
                name : 'customFields',
                type : 'auto'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.TimesheetType',
                name : 'timesheetType',
                associationKey : 'timesheetType'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.timesheet.Task',
                name : 'timesheetTasks',
                associationKey : 'timesheetTasks'
            },
            {
                model : 'criterion.model.employee.timesheet.Total',
                name : 'totals',
                associationKey : 'totals'
            },
            {
                model : 'criterion.model.employee.timesheet.AutoPopulate',
                name : 'autoPopulate',
                associationKey : 'autoPopulate'
            }
        ],

        getSummaryByPaycode : function() {
            let timesheetTasks = this.timesheetTasks(),
                result = {};

            timesheetTasks && timesheetTasks.each(function(day) {
                Ext.Object.each(day.getSummaryByPaycode(), function(incomeId, minutes) {
                    if (!result[incomeId]) {
                        result[incomeId] = 0;
                    }

                    result[incomeId] += minutes;
                })
            });

            return result;
        },

        getUnitsSummaryByPaycode : function() {
            let timesheetTasks = this.timesheetTasks(),
                result = {};

            timesheetTasks && timesheetTasks.each(function(day) {
                Ext.Object.each(day.getUnitsSummaryByPaycode(), function(incomeId, units) {
                    if (!result[incomeId]) {
                        result[incomeId] = 0;
                    }

                    result[incomeId] += units;
                })
            });

            return result;
        },

        getSummaryByAssignment : function() {
            let timesheetTasks = this.timesheetTasks(),
                result = {};

            timesheetTasks && timesheetTasks.each(function(day) {
                Ext.Object.each(day.getSummaryByAssignment(), function(assignmentId, minutes) {
                    if (!result[assignmentId]) {
                        result[assignmentId] = 0;
                    }

                    result[assignmentId] += minutes;
                })
            });

            return result;
        },

        getUnitsSummaryByAssignment : function() {
            let timesheetTasks = this.timesheetTasks(),
                result = {};

            timesheetTasks && timesheetTasks.each(function(day) {
                Ext.Object.each(day.getUnitsSummaryByAssignment(), function(assignmentId, units) {
                    if (!result[assignmentId]) {
                        result[assignmentId] = 0;
                    }

                    result[assignmentId] += units;
                })
            });

            return result;
        }
    };
});
