Ext.define('criterion.model.employee.TimeOff', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator(),
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.timeOff.Detail'
        ],

        fields : [
            {
                name : 'employeeId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'workflowLogId',
                type : 'integer',
                allowNull : true,
                persist : false
            },
            {
                name : 'timeOffTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.TIME_OFF_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'timeOffTypeDesc',
                type : 'criterion_codedatavalue',
                referenceField : 'timeOffTypeCd',
                persist : false
            },
            {
                name : 'notes',
                type : 'string'
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                allowNull : true,
                persist : false
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
                name : 'timeOffStatusCode',
                type : 'criterion_codedatavalue',
                referenceField : 'statusCd',
                persist : false,
                dataProperty : 'code'
            },
            {
                name : 'timeOffStatusDescription',
                type : 'criterion_codedatavalue',
                referenceField : 'statusCd',
                dataProperty : 'description',
                depends : 'statusCd'
            },

            {
                type : 'criterion_timezone',
                name : 'timezoneCd'
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT,
                persist : false
            },
            {
                name : 'timeOffDate',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT,
                persist : false
            },
            {
                name : 'timezoneDescription',
                type : 'string',
                persist : false
            },

            {
                name : 'totalHours',
                type : 'float',
                persist : false
            },
            {
                name : 'totalMinutes',
                type : 'integer',
                persist : false
            },
            {
                name : 'attachmentId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'attachmentName',
                type : 'string',
                allowNull : true
            },

            // only for create detail seq
            {
                name : 'startDateForCreate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false,
                caching : true
            },
            {
                name : 'duration',
                type : 'float',
                allowNull : true,
                validate : function (val, sep, smth, record) {
                    return record && record.get('isFullDay') ? true :
                        (Ext.isNumeric(val) ? true :  i18n.gettext('Required field'));
                },
                persist : false
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
                name : 'isFullDay',
                type : 'boolean',
                persist : false
            },
            {
                name : 'startTime',
                type : 'date',
                allowNull : true,
                dateFormat : criterion.consts.Api.TIME_FORMAT,
                persist : false,
                caching : true
            },
            {
                name : 'endDate',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT,
                persist : false,
                caching : true
            },
            {
                name : 'isRemovable',
                type : 'boolean',
                persist : false
            },
            {
                name : 'canBeSubmitted',
                type : 'boolean',
                persist : false,
                defaultValue : true // for phantom records
            },
            {
                name : 'isUpdatable',
                type : 'boolean',
                persist : false,
                defaultValue : true // for phantom records
            },
            {
                name : 'planName',
                type : 'string',
                persist : false
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIME_OFF
        },

        hasMany : [
            {
                model : 'criterion.model.employee.timeOff.Detail',
                name : 'details',
                associationKey : 'details'
            }
        ],

        hasEmptyDetails : function() {
            var details = this.details();
            return !details || details.count() === 0;
        }
    };

});
