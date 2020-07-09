Ext.define('criterion.model.employee.UnavailableBlock', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_UNAVAILABLE_BLOCK
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'timezoneCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.TIME_ZONE
            },
            {
                type : 'string',
                name : 'timezoneDesc',
                persist : false
            },
            {
                name : 'startTimestamp',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'endTimestamp',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'adjustedStartTimestamp',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT,
                persist : false
            },
            {
                name : 'adjustedEndTimestamp',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT,
                persist : false
            },
            {
                name : 'fullDay',
                type : 'boolean'
            },
            {
                name : 'recurringEndDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                critical : true
            },
            {
                name : 'recurring',
                type : 'boolean',
                convert : function(v, rec) {
                    if (typeof v === 'undefined') {
                        return !!rec.get('recurringEndDate');
                    } else {
                        return v;
                    }
                },
                persist : false
            },
            {
                name : 'isTimeOff',
                type : 'boolean'
            }
        ]
    };
});
