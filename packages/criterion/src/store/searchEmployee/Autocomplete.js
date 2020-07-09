Ext.define('criterion.store.searchEmployee.Autocomplete', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias: 'store.criterion_search_employee_autocomplete',

        requires : [ 'criterion.data.proxy.Rest' ],

        model : 'criterion.model.Person',
        autoLoad : false,

        remoteFilter: true,
        
        proxy : {
            type : 'criterion_rest',
            url : API.SEARCH_PERSON
        }
    };

});
