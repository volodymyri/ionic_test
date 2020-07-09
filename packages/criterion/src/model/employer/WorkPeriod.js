Ext.define('criterion.model.employer.WorkPeriod', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.employer.workPeriod.Day'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_WORK_PERIOD
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isGrace',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'startGrace',
                type : 'integer'
            },
            {
                name : 'startPoints',
                type : 'integer'
            },
            {
                name : 'endGrace',
                type : 'integer'
            },
            {
                name : 'endPoints',
                type : 'integer'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.workPeriod.Day',
                name : 'days',
                associationKey : 'days'
            }
        ]
    };
});
