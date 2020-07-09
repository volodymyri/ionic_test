Ext.define('criterion.model.employer.benefit.Option', function() {
    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_BENEFIT_PLAN_OPTION
        },

        fields : [
            {
                name : 'benefitPlanId',
                type : 'int'
            },
            {
                name : 'optionGroup',
                type : 'int'
            },
            {
                name : 'name',
                type : 'string',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'code',
                type : 'string',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'isAllowDependent',
                type : 'boolean'
            },
            {
                name : 'isAllowBeneficiary',
                type : 'boolean'
            },
            {
                name : 'isActive',
                type : 'boolean',
                defaultValue : true
            },
            {
                name : 'isDefault',
                type : 'boolean',
                defaultValue : false
            }
        ],

        hasMany : [
            {
                model : 'employer.benefit.Rate',
                name : 'values',
                associationKey : 'values'
            }
        ]
    };
});