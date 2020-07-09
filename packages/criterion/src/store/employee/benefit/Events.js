Ext.define('criterion.store.employee.benefit.Events', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.data.Store',
        alias : 'store.criterion_employee_benefit_events',

        model : 'criterion.model.employee.benefit.Event',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_BENEFIT_EVENT,
            extraParams : {
                isProcessed : false
            }
        }
    };

});
