Ext.define('criterion.model.employee.timesheet.vertical.Day', function() {

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.timesheet.vertical.TaskDetail'
        ],

        fields : [
            {
                name : 'timesheetId',
                type : 'integer'
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'overtimeHours',
                type : 'string'
            },
            {
                name : 'regHours',
                type : 'string'
            },
            {
                name : 'autoBreakHours',
                type : 'string'
            },
            {
                name : 'totalHours',
                type : 'string'
            },
            {
                name : 'totalDays',
                type : 'string'
            },
            {
                name : 'overtimeDays',
                type : 'string'
            },
            {
                name : 'regDays',
                type : 'string'
            }
        ],

        hasMany : [
            {
                model : 'employee.timesheet.vertical.TaskDetail',
                name : 'details',
                associationKey : 'details'
            }
        ],

        getSummaryByPaycode : function() {
            var taskDetails = this.details(),
                result = {};

            taskDetails && taskDetails.each(function(taskDetail) {
                var income = taskDetail.getIncome();

                switch (income['paycode']) {
                    case criterion.Consts.PAYCODE.TIME_OFF :
                    case criterion.Consts.PAYCODE.HOLIDAY :
                    case criterion.Consts.PAYCODE.INCOME :
                        if (!result[income.id]) {
                            result[income.id] = 0;
                        }

                        result[income.id] += criterion.Utils.hourStrParse(taskDetail.getTaskHoursString(), true);
                        break;
                }
            });

            return result;
        },

        getUnitsSummaryByPaycode : function() {
            var taskDetails = this.details(),
                result = {};

            taskDetails && taskDetails.each(function(taskDetail) {
                var income = taskDetail.getIncome();

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
            var taskDetails = this.details(),
                result = {};

            taskDetails && taskDetails.each(function(taskDetail) {
                var assignmentId = taskDetail.get('assignmentId');

                if (!result[assignmentId]) {
                    result[assignmentId] = 0;
                }

                result[assignmentId] += criterion.Utils.hourStrParse(taskDetail.getTaskHoursString(), true);
            });

            return result;
        },

        getUnitsSummaryByAssignment : function() {
            var taskDetails = this.details(),
                result = {};

            taskDetails && taskDetails.each(function(taskDetail) {
                var assignmentId = taskDetail.get('assignmentId');

                if (!result[assignmentId]) {
                    result[assignmentId] = 0;
                }

                result[assignmentId] += taskDetail.get('units');
            });

            return result;
        }
    };
});
