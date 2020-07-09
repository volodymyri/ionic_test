Ext.define('criterion.store.Taxes', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_taxes',

        model : 'criterion.model.Tax',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
        remoteSort : true,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.TAX
        }
    };
});
