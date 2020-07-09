Ext.define('criterion.model.employee.timeOff.TimeBalance', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'accrued',
                type : 'float'
            },
            {
                name : 'taken',
                type : 'float'
            },
            {
                name : 'planned',
                type : 'float'
            },
            {
                name : 'balance',
                type : 'float'
            },
            {
                name : 'planIsAccrualInDays',
                type : 'boolean'
            },
            {
                name : 'isEmpty',
                calculate : function(data) {
                    return !!data && data.accrued === 0 && data.taken === 0 && data.planned === 0;
                }
            },
            {
                name : 'positiveBalance',
                calculate : data => Math.abs(data.balance)
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIME_OFF_DETAIL
        }
    };

});
