Ext.define('criterion.model.employee.timesheet.Task', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.timesheet.Income',
            'criterion.model.employee.timesheet.TaskDetail',
            'criterion.data.field.CustomFieldValue'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIMESHEET_TASK
        },

        fields : [
            {
                name : 'timesheetId',
                type : 'int'
            },
            {
                name : 'assignmentId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'assignmentName',
                type : 'string',
                persist : false
            },
            {
                name : 'taskId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'taskName',
                type : 'string',
                persist : false
            },
            {
                name : 'employerWorkLocationId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'locationName',
                type : 'string',
                persist : false
            },
            {
                name : 'customValue1',
                type : 'custom_field_value',
                allowNull : true
            },
            {
                name : 'customValue2',
                type : 'custom_field_value',
                allowNull : true
            },
            {
                name : 'customValue3',
                type : 'custom_field_value',
                allowNull : true
            },
            {
                name : 'customValue4',
                type : 'custom_field_value',
                allowNull : true
            },
            {
                name : 'customValue1Type',
                type : 'string',
                persist : false
            },
            {
                name : 'customValue2Type',
                type : 'string',
                persist : false
            },
            {
                name : 'customValue3Type',
                type : 'string',
                persist : false
            },
            {
                name : 'customValue4Type',
                type : 'string',
                persist : false
            },
            {
                name : 'isApproved',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isPendingApproval',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isUpdatable',
                type : 'boolean',
                persist : false,
                defaultValue : true // for phantom records
            },
            {
                name : 'isRemovable',
                type : 'boolean',
                persist : false,
                defaultValue : true // for phantom records
            },
            {
                name : 'isBreak',
                type : 'boolean'
            },
            {
                name : 'isHoliday',
                type : 'boolean'
            },
            {
                name : 'isIncome',
                type : 'boolean'
            },
            {
                name : 'isTimeOff',
                type : 'boolean'
            },
            {
                name : 'employeeTaskName',
                type : 'string',
                persist : false
            },
            {
                name : 'employerWorkLocationName',
                type : 'string',
                persist : false
            },
            {
                name : 'isUnits',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isStarted',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isApplicableToApprover',
                type : 'boolean',
                allowNull : true,
                persist : false
            },
            {
                name : 'paycodeDetailId',
                type : 'string',
                persist : false
            },
            {
                name : 'workLocationAreaId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'paycodeChanged',
                type : 'boolean',
                persist : false,
                defaultValue : false
            },

            {
                name : 'projectId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'projectName',
                type : 'string',
                persist : false
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.employee.timesheet.Income',
                name : 'paycodeDetail',
                associationKey : 'paycodeDetail'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.timesheet.TaskDetail',
                name : 'timesheetTaskDetails',
                associationKey : 'timesheetTaskDetails'
            }
        ],

        /**
         * Alternative getter for paycode to overcome phantom issue on Ext hasOne association.
         * @returns {*}
         */
        getIncome : function() {
            return this.getPaycodeDetail() ? this.getPaycodeDetail().getData() : this.getData()['paycodeDetail'];
        },

        getSummaryByPaycode : function() {
            var taskDetails = this.timesheetTaskDetails(),
                income = this.getIncome(),
                result = {};

            taskDetails && taskDetails.each(function(taskDetail) {
                switch (income['paycode']) {
                    case criterion.Consts.PAYCODE.TIME_OFF :
                    case criterion.Consts.PAYCODE.HOLIDAY :
                    case criterion.Consts.PAYCODE.INCOME :
                        if (!result[income.id]) {
                            result[income.id] = 0;
                        }

                        result[income.id] += taskDetail.get('hours') * 60 + taskDetail.get('minutes');
                        break;
                }
            });

            return result;
        },

        getUnitsSummaryByPaycode : function() {
            var taskDetails = this.timesheetTaskDetails(),
                income = this.getIncome(),
                result = {};

            taskDetails && taskDetails.each(function(taskDetail) {
                switch (income['paycode']) {
                    case criterion.Consts.PAYCODE.TIME_OFF :
                    case criterion.Consts.PAYCODE.HOLIDAY :
                    case criterion.Consts.PAYCODE.INCOME :
                        if (!result[income.id]) {
                            result[income.id] = 0;
                        }
                        var units = taskDetail.get('units');
                        result[income.id] += units;
                        break;
                }
            });

            return result;
        },

        getSummaryByAssignment : function() {
            var taskDetails = this.timesheetTaskDetails(),
                result = {},
                assignmentId = this.get('assignmentId');

            taskDetails && taskDetails.each(function(taskDetail) {

                if (!result[assignmentId]) {
                    result[assignmentId] = 0;
                }

                result[assignmentId] += taskDetail.get('hours') * 60 + taskDetail.get('minutes');
            });

            return result;
        },

        getUnitsSummaryByAssignment : function() {
            var taskDetails = this.timesheetTaskDetails(),
                result = {},
                assignmentId = this.get('assignmentId');

            taskDetails && taskDetails.each(function(taskDetail) {
                if (!result[assignmentId]) {
                    result[assignmentId] = 0;
                }

                result[assignmentId] += taskDetail.get('units');
            });

            return result;
        },

        needSync : function() {
            //TODO Check it! Strange logic.
            return !this.get('isApproved') && (this.timesheetTaskDetails().needSync() || this.getPaycodeDetail().dirty);
        }

    };
});
