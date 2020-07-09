Ext.define('criterion.model.employer.workPeriod.Detail', function() {

    const VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory',
            reader : {
                type : 'json'
            }
        },

        fields : [
            {
                name : 'workPeriodDayId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'scheduledStart',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },
            {
                name : 'scheduledEnd',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            }
        ]
    };
});
