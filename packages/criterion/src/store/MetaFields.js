Ext.define('criterion.store.MetaFields', function() {

    return {
        alias : 'store.criterion_meta_fields',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.MetaField',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.META_FIELD
        }
    };
});
