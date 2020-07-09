Ext.define('criterion.store.CustomLocalizations', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.CustomLocalization',
        alias : 'store.criterion_custom_localizations',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.CUSTOM_LOCALIZATION
        }
    };
});

