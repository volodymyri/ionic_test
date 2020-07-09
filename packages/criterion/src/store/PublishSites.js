Ext.define('criterion.store.PublishSites', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_publish_sites',

        model : 'criterion.model.PublishSite',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.PUBLISH_SITE
        }
    };
});
