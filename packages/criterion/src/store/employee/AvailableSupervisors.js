Ext.define('criterion.store.employee.AvailableSupervisors', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.LoadProtectedStore',
        alias : 'store.criterion_employee_available_supervisors',

        model : 'criterion.model.employee.Search',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_AVAILABLE_SUPERVISORS
        }
    };

});
