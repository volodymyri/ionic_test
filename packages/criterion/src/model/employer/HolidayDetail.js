Ext.define('criterion.model.employer.HolidayDetail', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'holidayId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isAllDay',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY],
                defaultValue : true
            },
            {
                name : 'startTime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT,
                allowNull : true
            },
            {
                name : 'endTime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT,
                allowNull : true
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_HOLIDAY_DETAIL
        }
    };
});
