Ext.define('criterion.model.employee.timesheet.Vertical', function() {

    const API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.timesheet.vertical.Day',
            'criterion.model.CustomData',
            'criterion.model.TimesheetType'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIMESHEET_VERTICAL,
            appendId : false
        },

        fields : [
            {
                name : 'employeeId',
                type : 'integer',
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
                name : 'endDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'formattedTotalHours',
                type : 'string'
            },
            {
                name : 'isCurrent',
                type : 'boolean'
            },
            {
                name : 'isVertical',
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
                name : 'hasAutoBreaks',
                type : 'boolean',
                persist : false
            },
            {
                name : 'totalOvertimeHours',
                type : 'string'
            },
            {
                name : 'totalRegHours',
                type : 'string'
            },
            {
                name : 'totalDays',
                type : 'float',
                persist : false
            },
            {
                name : 'totalRegDays',
                type : 'float',
                persist : false
            },
            {
                name : 'totalOvertimeDays',
                type : 'float',
                persist : false
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                allowNull : true
            },
            {
                name : 'timesheetStatusCode',
                type : 'string'
            },
            {
                name : 'totalHours',
                type : 'string'
            },
            {
                name : 'totalHoursVal',
                persist : false,
                depends : 'totalHours',
                calculate : function(timesheet) {
                    if (!timesheet) {
                        return 0;
                    }

                    return Ext.util.Format.employerAmountPrecision(criterion.Utils.hourStrParse(timesheet.totalHours, true) / 60);
                }
            },
            {
                name : 'workflowLogId',
                type : 'integer'
            },
            {
                name : 'outButtonDescription',
                type : 'string'
            },
            {
                name : 'timesheetTypeId',
                type : 'integer'
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
                name : 'notSubmittedOrRejected',
                type : 'boolean',
                persist : false,
                depends : 'timesheetStatusCode',
                calculate : function(timesheet) {
                    if (!timesheet) {
                        return false
                    }

                    const WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

                    return Ext.Array.contains([
                        WORKFLOW_STATUSES.NOT_SUBMITTED, WORKFLOW_STATUSES.REJECTED
                    ], timesheet.timesheetStatusCode)
                }
            },
            {
                name : 'canBeEdited',
                type : 'boolean',
                persist : false,
                depends : 'notSubmittedOrRejected',
                convert : function(value, timesheet) {
                    if (!timesheet) {
                        return false
                    }

                    let timesheetType = timesheet && (Ext.isFunction(timesheet['getTimesheetType']) && timesheet.getTimesheetType() || timesheet.get('timesheetType')),
                        isButtonType, isEnterTimeoff, isEnterHoliday;

                    if (timesheetType) {
                        isButtonType = (timesheetType.isModel && timesheetType.get('entryType') || timesheetType.entryType === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON);
                        isEnterTimeoff = timesheetType.isModel && timesheetType.get('isEnterTimeoff') || timesheetType.isEnterTimeoff;
                        isEnterHoliday = timesheetType.isModel && timesheetType.get('isEnterHoliday') || timesheetType.isEnterHoliday;

                        if (isButtonType && !isEnterTimeoff && !isEnterHoliday) {
                            return false
                        }
                    }

                    return timesheet.isModel ? timesheet.get('notSubmittedOrRejected') : timesheet.notSubmittedOrRejected;
                }
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
                model : 'employee.timesheet.vertical.Day',
                name : 'days',
                associationKey : 'days'
            }
        ],

        getSummaryByPaycode : function() {
            let days = this.days(),
                result = {};

            days && days.each(function(day) {
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
            let days = this.days(),
                result = {};

            days && days.each(function(day) {
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
            let days = this.days(),
                result = {};

            days && days.each(function(day) {
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
            let days = this.days(),
                result = {};

            days && days.each(function(day) {
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
