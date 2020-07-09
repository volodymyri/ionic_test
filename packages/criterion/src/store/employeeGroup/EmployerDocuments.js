Ext.define('criterion.store.employeeGroup.EmployerDocuments', function() {

    const API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employee_group_employer_document',

        model : 'criterion.model.employeeGroup.EmployerDocument',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_EMPLOYER_DOCUMENT
        }
    };
});
