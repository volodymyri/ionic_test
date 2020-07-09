Ext.define('criterion.store.EmailLayouts', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_email_layouts',

        extend : 'criterion.data.Store',

        model : 'criterion.model.EmailLayout',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMAIL_LAYOUT
        }
    };
});
