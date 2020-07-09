Ext.define('criterion.model.employee.Income', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();


    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_INCOME
        },

        fields : [
            {
                name : 'employeeId',
                type : 'int'
            },
            {
                name : 'incomeListId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'showInTimesheet',
                type : 'boolean'
            },
            {
                name : 'amount',
                type : 'float',
                serialize : criterion.Utils.zeroToNull
            },
            {
                name : 'incomeListCode',
                convert : function(value, record) {
                    var incomeList = record && record.get('incomeList');
                    return incomeList && incomeList.code || value;
                }
            },
            {
                name : 'incomeListDescription',
                convert : function(value, record) {
                    var incomeList = record && record.get('incomeList');
                    return incomeList && incomeList.description || value;
                }
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'expirationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            }
        ],

        hasOne : [
            {
                model : 'employer.IncomeList',
                name : 'incomeList',
                associationKey : 'incomeList'
            }
        ]
    };
});
