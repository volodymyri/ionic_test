Ext.define('criterion.store.searchEmployee.ByNameEmployees', function () {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_search_employee_by_name_employees',

        extend : 'criterion.data.Store',

        requires : [ 'criterion.data.proxy.Rest' ],

        model : 'criterion.model.searchEmployee.ByNameEmployee',
        autoLoad : false,

        remoteFilter : true,

        proxy : {
            type : 'criterion_rest',
            url : API.SEARCH_PERSON_BY_NAME
        }
    };

});
