Ext.define('criterion.model.employer.Holiday', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.employer.HolidayDetail'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_HOLIDAY
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'code',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'year',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'regularDaysClosed',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'holidayCount',
                type : 'int',
                persist : false
            },
            {
                name : 'averageHours',
                type : 'string',
                allowNull : true
            },
            {
                name : 'incomeListId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'incomeCode',
                type : 'string'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.HolidayDetail',
                name : 'details',
                associationKey : 'details'
            }
        ]
    };
});
