Ext.define('criterion.store.Transfers', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_transfers',

        extend : 'criterion.data.Store',

        model : 'criterion.model.Transfer',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});
