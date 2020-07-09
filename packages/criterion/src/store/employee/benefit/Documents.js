Ext.define('criterion.store.employee.benefit.Documents', function() {

    return {

        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_benefit_documents',

        model : 'criterion.model.employee.benefit.Document',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_BENEFIT_DOCUMENT
        }
    };

});
