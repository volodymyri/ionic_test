Ext.define('criterion.model.employee.benefit.Option', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_BENEFIT_OPTION
        },

        fields : [
            {
                name : 'employeeBenefitId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'benefitPlanOptionId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'optionGroup',
                type : 'integer'
            },
            {
                name : 'manualValue',
                type : 'float',
                allowNull : true
            }
        ]
    };
});
