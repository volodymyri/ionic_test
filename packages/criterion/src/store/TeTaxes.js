Ext.define('criterion.store.TeTaxes', function() {

    return {

        extend : 'criterion.data.Store',

        alias : 'store.criterion_te_taxes',

        model : 'criterion.model.TeTax',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.TE_TAX
        }
    };
});
