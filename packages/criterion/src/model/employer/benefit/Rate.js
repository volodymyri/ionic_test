Ext.define('criterion.model.employer.benefit.Rate', function() {
    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_BENEFIT_PLAN_RATE
        },

        fields : [
            {
                name : 'benefitPlanId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'value',
                type : 'float',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'rateCode',
                type : 'string',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'rateDescription',
                type : 'string'
            },
            {
                name : 'tier',
                type : 'float'
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            }
        ]
    };
});