Ext.define('criterion.store.search.EmployeesDelegation', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.LoadProtectedStore',
        alias : 'store.criterion_search_employees_delegation',
        storeId : 'searchEmployeesDelegation',

        model : 'criterion.model.employee.SearchDelegation',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_SEARCH_DELEGATION
        }
    };

});
