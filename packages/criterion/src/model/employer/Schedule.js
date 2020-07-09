Ext.define('criterion.model.employer.Schedule', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.employer.schedule.Task'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_SCHEDULE
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'recurrenceCd',
                type : 'criterion_codedata',
                codeDataId : DICT.RECURRENCE_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'recurrenceCode',
                type : 'criterion_codedatavalue',
                referenceField : 'recurrenceCd',
                dataProperty : 'code',
                persist : false
            },
            {
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'isDailySystemTask',
                type : 'boolean'
            },
            {
                name : 'startTime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            },
            {
                name : 'dayPattern',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'weekPattern',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'monthPattern',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'monthPatternDay',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'monthPatternWeek',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'yearPatternDay',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'yearPatternMonth',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'isOddWeek',
                type : 'boolean'
            },
            {
                name : 'lastRunDate',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT,
                persist : false
            },
            {
                name : 'lastRunStatus',
                type : 'integer',
                persist : false,
                allowNull : true
            },
            {
                name : 'lastRunError',
                type : 'string',
                allowNull : true,
                persist : false
            },
            {
                name : 'interval',
                type : 'integer',
                allowNull : true
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.schedule.Task',
                name : 'tasks',
                associationKey : 'tasks'
            }
        ]
    };
});
