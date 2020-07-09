Ext.define('criterion.model.employer.certifiedRate.Detail', function() {

    var VALIDATOR = criterion.Consts.getValidator();

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
                name : 'certifiedRateId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'positionId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'rate',
                type : 'float',
                allowNull : true
            },
            {
                name : 'positionCode',
                type : 'string',
                persist : false
            },
            {
                name : 'positionTitle',
                type : 'string',
                persist : false
            },
            {
                name : 'rateType',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY],
                defaultValue : 0
            },
            {
                name : 'incomeListId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'incomeListName',
                type : 'string',
                persist : false
            },
            {
                name : 'deductionId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'deductionName',
                type : 'string',
                persist : false
            },
            {
                name : 'employeeAmount',
                type : 'float',
                allowNull : true
            },
            {
                name : 'employerAmount',
                type : 'float',
                allowNull : true
            },
            {
                name : 'deductionCalcMethodCode',
                type : 'string',
                persist : false
            },
            {
                name : 'deductionCalcMethodIsPercent',
                type : 'string',
                calculate : function(data) {
                    return data && data.deductionCalcMethodCode === criterion.Consts.DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_PERCENT;
                }
            }
        ]
    };

});
