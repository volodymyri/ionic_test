Ext.define('criterion.store.TeReciprocities', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.TeReciprocity',
        alias : 'store.criterion_te_reciprocities',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.TE_RECIPROCITY
        }
    };
});

