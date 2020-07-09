Ext.define('criterion.model.employer.shiftRate.Detail', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.proxy.Rest'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_SHIFT_RATE_DETAIL
        },

        fields : [
            {
                name : 'shiftRateId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'weekPattern', // (7 bits representing Sunday (1) to Saturday (7), it is possible to select multiple days)
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
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
                depends : ['startTime', 'hours', 'minutes'],
                persist : false,
                calculate : function(data) {
                    return data.startTime && new Date(data.startTime.getTime() + data.hours * 1000 * 60 * 60 + data.minutes * 1000 * 60);
                }
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
                name : 'isPercentage',
                type : 'boolean'
            },
            {
                name : 'amount',
                type : 'float'
            }
        ]
    };

});
