Ext.define('criterion.model.employee.timeOff.Detail', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'employeeTimeOffId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                type : 'criterion_timezone',
                name : 'timezoneCd'
            },
            {
                name : 'timeOffDate',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'duration',
                type : 'float',
                allowNull : true
            },
            {
                name : 'durationString',
                type : 'string',
                depends : 'duration',
                calculate : function(data) {
                    return data.duration ? criterion.Utils.minutesToTimeStr(data.duration) : null;
                },
                validate : function(val, sep, smth, record) {
                    return record && record.get('isFullDay') ? true :
                        (Ext.isDefined(val) ? true : i18n.gettext('Required field'));
                }
            },
            {
                name : 'isEditable',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isRemovable',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isFullDay',
                type : 'boolean'
            },
            {
                name : 'timezoneDescription',
                type : 'string',
                persist : false
            },
            {
                name : 'startTime',
                type : 'date',
                allowNull : true,
                dateFormat : criterion.consts.Api.TIME_FORMAT,
                persist : false
            },

            {
                name : 'startTimeStr',
                type : 'string',
                persist : false,
                calculate : function(data) {
                    return data && (data.isFullDay ? '' : (Ext.util.Format.dateRenderer(criterion.consts.Api.TIME_FORMAT_US)(data.timeOffDate) + ' ' + data.timezoneDescription));
                }
            },
            {
                name : 'durationStr',
                type : 'string',
                persist : false,
                calculate : function(data) {
                    return data && (data.isFullDay ? i18n.gettext('all day') : Ext.util.Format.number(data.duration / 60, '0.00') + i18n.gettext(' hours'));
                }
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.employee.TimeOff',
                name : 'employeeTimeOff',
                associationKey : 'employeeTimeOff'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIME_OFF_DETAIL
        }
    };

});
