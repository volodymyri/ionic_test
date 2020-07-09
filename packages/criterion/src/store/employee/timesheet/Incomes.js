Ext.define('criterion.store.employee.timesheet.Incomes', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employee_timesheet_available_incomes',

        model : 'criterion.model.employee.timesheet.Income',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIMESHEET_INCOME_CODES
        },

        grouper : {
            property : 'paycode'
        },

        constructor : function() {
            this.callParent(arguments);
            this.on('sort', this.applySeparator, this);
            this.on('load', this.applySeparator, this);
        },

        applySeparator : function(store) {
            var groupCodes = {};

            store.each(function(incomeCode) {
                if (!groupCodes[incomeCode.get('paycode')]) {
                    groupCodes[incomeCode.get('paycode')] = true;
                    Ext.defer(function() {
                        incomeCode.set('isFirstInGroup', true);
                    }, 100);
                } else {
                    incomeCode.set('isFirstInGroup', false);
                }
            })
        }

    };

});
