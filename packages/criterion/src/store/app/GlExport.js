Ext.define('criterion.store.app.GlExport', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_app_gl_export',

        model : 'criterion.model.App',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.APP,
            extraParams : {
                buttonCd : criterion.Consts.APP_BUTTON_TYPES.GL_EXPORT
            }
        },

        listeners : {
            load : function(store, records, success) {
                if (success) {
                    store.add(Ext.create('criterion.model.App', {
                        id : criterion.Consts.GL_INTERFACE_EXPORT_TYPE_FILE_ID,
                        name : i18n.gettext('File'),
                        responseFormat : criterion.Consts.GL_RESPONSE_FORMAT.CSV
                    }));
                }
            }
        }
    };
});
