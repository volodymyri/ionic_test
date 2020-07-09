Ext.define('criterion.store.person.EssUsers', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',
        alias: 'store.person.EssUsers',

        requires : [ 'criterion.data.proxy.Rest' ],

        model : 'criterion.model.Person',
        autoLoad : false,
        pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,

        remoteFilter: true,

        proxy : {
            type : 'criterion_rest',
            url : API.SEARCH_ESS_USERS,
            reader : {
                totalProperty : 'count'
            }
        }
    };

});
