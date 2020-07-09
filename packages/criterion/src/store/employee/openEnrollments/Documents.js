Ext.define('criterion.store.employee.openEnrollment.Documents', function() {

    return {

        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_open_enrollment_documents',

        model : 'criterion.model.employee.openEnrollment.Document',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_OPEN_ENROLLMENT_DOCUMENT
        }
    };

});
