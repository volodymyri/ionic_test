Ext.define('criterion.model.employee.timesheet.ByDateDetail', function() {

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.field.CustomFieldValue'
        ],

        fields : [
            {
                name : 'timesheetId',
                type : 'int'
            },
            {
                name : 'assignmentId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
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
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'locationName',
                type : 'string',
                persist : false
            },
            {
                name : 'units',
                type : 'number'
            },
            {
                name : 'hours',
                type : 'int'
            },
            {
                name : 'minutes',
                type : 'int'
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'formattedHours',
                persist : false,
                depends : ['hours', 'minutes'],
                calculate : function(data) {
                    return criterion.Utils.timeObjToStr(data);
                }
            },
            {
                name : 'hoursToGrid',
                persist : false,
                depends : ['formattedHours', 'units'],
                calculate : function(data) {
                    return data.units ? data.units : data.formattedHours;
                }
            },
            {
                name : 'startTime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },
            {
                name : 'endTime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },
            {
                name : 'timerStartDatetime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
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
                name : 'paycode',
                type : 'integer'
            },
            {
                name : 'entityRef',
                type : 'integer'
            },
            {
                name : 'paycodeRef',
                persist : false,
                calculate : function(data) {
                    return data['paycode'] + '-' + data['entityRef'];
                }
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
                name : 'isBreak',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isHoliday',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isIncome',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isTimeOff',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isApprovedTimeOff',
                type : 'boolean',
                persist : false
            },
            {
                name : 'paycodeName',
                persist : false,
                calculate : function(data) {
                    return data && data['paycodeDetail'] && data['paycodeDetail'].name || ''
                }
            },
            {
                name : 'paycodeDetail'
            }
        ],

        proxy : {
            type : 'memory'
        }
    };
});
