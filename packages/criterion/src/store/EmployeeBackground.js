Ext.define('criterion.store.EmployeeBackground', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_background',

        model : 'criterion.model.EmployeeBackground',

        autoLoad : false,

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_BACKGROUND
        }
    };
});
