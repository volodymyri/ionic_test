Ext.define('criterion.store.search.Employees', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.LoadProtectedStore',
        alias : 'store.criterion_search_employees',
        storeId : 'searchEmployees',

        model : 'criterion.model.employee.Search',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_SEARCH
        }
    };

});
