Ext.define('criterion.store.CustomFieldFormats', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.CustomFieldFormat',
        alias : 'store.criterion_custom_field_formats',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.FIELD_FORMAT_CUSTOM
        }
    };
});

