Ext.define('criterion.store.MetaTables', function() {

    return {
        alias : 'store.criterion_meta_tables',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.MetaTable',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.META_TABLE
        }
    };
});
