Ext.define('criterion.store.employer.payrollBatch.AvailableEmployees', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_available_employees',

        model : 'criterion.model.employer.payrollBatch.AvailableEmployee',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
        remoteFilter : true,
        remoteSort : true,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_BATCH_AVAILABLE_EMPLOYEES
        }
    };

});
