Ext.define('criterion.model.employer.Overtime', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        fields : [
            {
                name : 'code',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isCompTime',
                type : 'boolean'
            },
            {
                name : 'isAutoDeductBreak',
                type : 'boolean'
            },
            {
                name : 'isMealPeriod',
                type : 'boolean'
            },
            {
                name : 'expCalcMealPeriod',
                type : 'string',
                allowNull : true
            },
            {
                name : 'isShiftSplit',
                type : 'boolean'
            },
            {
                name : 'expCalcShiftSplit',
                type : 'string',
                allowNull : true
            },
            {
                name : 'isShiftSpread',
                type : 'boolean'
            },
            {
                name : 'expCalcShiftSpread',
                type : 'string',
                allowNull : true
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_OVERTIME
        }
    };
});
