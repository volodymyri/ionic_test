Ext.define('criterion.model.employer.Onboarding', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.employer.onboarding.Detail'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_ONBOARDING
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'countTasks',
                type : 'integer',
                persist : false
            },
            {
                name : 'isPreHire',
                type : 'boolean'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.onboarding.Detail',
                name : 'details',
                associationKey : 'details'
            }
        ]
    };
});
