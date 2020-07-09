Ext.define('criterion.store.searchEmployee.Employees', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',
        alias: 'store.searchEmployee.Employees',

        requires : [ 'criterion.data.proxy.Rest' ],

        model : 'criterion.model.Person',
        autoLoad : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        remoteFilter: true,

        proxy : {
            type : 'criterion_rest',
            url : API.SEARCH_PERSON,
            reader : {
                totalProperty : 'count'
            }
        }
    };

});
