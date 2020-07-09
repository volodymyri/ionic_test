Ext.define('criterion.store.employee.Documents', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employee_documents',

        model : 'criterion.model.employee.Document',
        autoLoad : false,
        autoSync : true,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };

});
